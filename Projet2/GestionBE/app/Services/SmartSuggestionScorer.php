<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Skill-based scoring engine for smart formation participant suggestions.
 *
 * Score breakdown (max 100):
 *   +60  skill coverage (covered_skills / missing_skills * 60)
 *   +10  formation domain matches employee area
 *   +10  employee has low existing skill levels in target area
 *   +10  employee never attended similar training
 *   +20  excellent attendance rate (>= 80%)
 *   -15  poor attendance rate (< 60%)
 */
class SmartSuggestionScorer
{
    protected object $formation;
    protected string $domaineLower;

    /** Aggregated formation stats keyed by employe_id */
    protected $formationStats;

    /** Competence IDs taught by this formation */
    protected array $formationCompetenceIds = [];

    /** Map: employe_id => [competence_id => niveau] */
    protected array $employeeCompetenceMap = [];

    /** Map: employe_id => [competence_id => niveau_requis] for their poste */
    protected array $posteRequirementsMap = [];

    /** Map: employe_id => bool (had a recent domain formation) */
    protected array $recentDomainByEmployee = [];

    /** Map: employe_id => float|null  global attendance rate (0-100) */
    protected array $attendanceRateByEmployee = [];

    /** Whether optional tables exist */
    protected bool $hasGpPostes;
    protected bool $hasGpPosteCompetence;
    protected bool $hasGpEmployeCompetence;
    protected bool $hasGpFormationCompetences;

    public function __construct(object $formation, $formationStats)
    {
        $this->formation       = $formation;
        $this->domaineLower    = strtolower(trim($formation->domaine ?? ''));
        $this->formationStats  = $formationStats;

        $this->hasGpPostes             = Schema::hasTable('gp_postes');
        $this->hasGpPosteCompetence    = Schema::hasTable('gp_poste_competence');
        $this->hasGpEmployeCompetence  = Schema::hasTable('gp_employe_competence');
        $this->hasGpFormationCompetences = Schema::hasTable('gp_formation_competences');
    }

    // ────────────────────────────────────────────────────────────────
    // Pre-loading (bulk queries – call once before looping employees)
    // ────────────────────────────────────────────────────────────────

    /**
     * Load competences taught by this formation.
     */
    public function loadFormationCompetences(): void
    {
        if (!$this->hasGpFormationCompetences) return;

        $this->formationCompetenceIds = DB::table('gp_formation_competences')
            ->where('formation_id', $this->formation->id)
            ->pluck('competence_id')
            ->toArray();
    }

    /**
     * @deprecated Use loadFormationCompetences instead
     */
    public function loadRequiredCompetences(): void
    {
        $this->loadFormationCompetences();
    }

    /**
     * Load poste requirements for all candidate employees.
     */
    public function loadPosteRequirements(array $employeeIds): void
    {
        if (!$this->hasGpPostes || !$this->hasGpPosteCompetence || empty($employeeIds)) return;

        // Get poste_id for each employee
        $employeePostes = DB::table('employes')
            ->whereIn('id', $employeeIds)
            ->whereNotNull('poste_id')
            ->pluck('poste_id', 'id')
            ->toArray();

        if (empty($employeePostes)) return;

        $posteIds = array_unique(array_values($employeePostes));

        // Get requirements for all postes
        $requirements = DB::table('gp_poste_competence')
            ->whereIn('poste_id', $posteIds)
            ->select('poste_id', 'competence_id', 'niveau_requis')
            ->get();

        // Build map: poste_id => [competence_id => niveau_requis]
        $posteReqMap = [];
        foreach ($requirements as $req) {
            $posteReqMap[$req->poste_id][$req->competence_id] = $req->niveau_requis ?? 1;
        }

        // Map to employees
        foreach ($employeePostes as $empId => $posteId) {
            $this->posteRequirementsMap[$empId] = $posteReqMap[$posteId] ?? [];
        }
    }

    /**
     * Bulk-load competences for all candidate employees with their levels.
     */
    public function loadEmployeeCompetences(array $employeeIds): void
    {
        if (!$this->hasGpEmployeCompetence || empty($employeeIds)) return;

        $rows = DB::table('gp_employe_competence')
            ->whereIn('employe_id', $employeeIds)
            ->select('employe_id', 'competence_id', 'niveau', 'niveau_acquis')
            ->get();

        foreach ($rows as $row) {
            $niveau = $row->niveau ?? $row->niveau_acquis ?? 0;
            $this->employeeCompetenceMap[$row->employe_id][$row->competence_id] = (int) $niveau;
        }
    }

    /**
     * Mark employees who attended a formation in the same domaine
     * within the last 6 months.
     */
    public function loadRecentDomainFormations(array $employeeIds): void
    {
        if ($this->domaineLower === '' || empty($employeeIds)) return;

        $since = Carbon::now()->subMonths(6)->toDateTimeString();

        $rows = DB::table('formation_participants')
            ->join('formations', 'formations.id', '=', 'formation_participants.formation_id')
            ->whereIn('formation_participants.employe_id', $employeeIds)
            ->where('formation_participants.created_at', '>=', $since)
            ->whereRaw('LOWER(COALESCE(formations.domaine, \'\')) = ?', [$this->domaineLower])
            ->pluck('formation_participants.employe_id')
            ->toArray();

        foreach ($rows as $id) {
            $this->recentDomainByEmployee[(int) $id] = true;
        }
    }

    /**
     * Bulk-load global attendance rates for candidate employees.
     */
    public function loadAttendanceRates(array $employeeIds): void
    {
        if (empty($employeeIds)) return;
        if (!Schema::hasTable('formation_sessions') || !Schema::hasTable('formation_attendance')) return;

        $rows = DB::table('formation_participants as fp')
            ->select([
                'fp.employe_id',
                DB::raw('COUNT(DISTINCT fs.id) AS total_sessions'),
                DB::raw("SUM(CASE WHEN fa.statut = 'Présent' THEN 1 ELSE 0 END) AS total_present"),
            ])
            ->join('formation_sessions as fs', 'fs.formation_id', '=', 'fp.formation_id')
            ->leftJoin('formation_attendance as fa', function ($join) {
                $join->on('fa.session_id', '=', 'fs.id')
                     ->on('fa.employe_id', '=', 'fp.employe_id');
            })
            ->whereIn('fp.employe_id', $employeeIds)
            ->groupBy('fp.employe_id')
            ->get();

        foreach ($rows as $row) {
            $total = (int) $row->total_sessions;
            $present = (int) $row->total_present;
            $this->attendanceRateByEmployee[(int) $row->employe_id] =
                $total > 0 ? round(($present / $total) * 100, 1) : null;
        }
    }

    // ────────────────────────────────────────────────────────────────
    // Scoring
    // ────────────────────────────────────────────────────────────────

    /**
     * Calculate skill gap for an employee based on their poste requirements.
     *
     * @param  int  $empId
     * @return array ['missing' => competence_ids[], 'levels' => [comp_id => gap]]
     */
    protected function calculateSkillGap(int $empId): array
    {
        $posteRequirements = $this->posteRequirementsMap[$empId] ?? [];
        $employeeSkills = $this->employeeCompetenceMap[$empId] ?? [];

        $missingIds = [];
        $gapLevels = [];

        foreach ($posteRequirements as $compId => $requiredLevel) {
            $currentLevel = $employeeSkills[$compId] ?? 0;
            if ($currentLevel < $requiredLevel) {
                $missingIds[] = $compId;
                $gapLevels[$compId] = $requiredLevel - $currentLevel;
            }
        }

        return [
            'missing' => $missingIds,
            'levels' => $gapLevels,
        ];
    }

    /**
     * Calculate the score and reasons for a single employee.
     *
     * @param  object  $emp        Employe model instance
     * @param  string[] $deptNames Department names
     * @return array
     */
    public function score(object $emp, array $deptNames): array
    {
        $score   = 0;
        $reasons = [];

        $empStats        = $this->formationStats->get($emp->id);
        $formationsCount = (int) ($empStats?->total_formations    ?? 0);
        $lastDate        = $empStats?->last_formation_date ?? null;

        // ═══════════════════════════════════════════════════════════════
        // SKILL GAP ANALYSIS (main scoring criterion - up to 60 points)
        // ═══════════════════════════════════════════════════════════════

        $skillGapData = $this->calculateSkillGap((int) $emp->id);
        $missingSkillIds = $skillGapData['missing'];
        $skillGapCount = count($missingSkillIds);

        // Find which missing skills are covered by this formation
        $coveredSkillIds = array_intersect($missingSkillIds, $this->formationCompetenceIds);
        $coveredCount = count($coveredSkillIds);

        // Get names for display
        $coveredNames = [];
        $missingNames = [];
        $remainingGapIds = array_diff($missingSkillIds, $coveredSkillIds);

        if (Schema::hasTable('gp_competences')) {
            if (!empty($coveredSkillIds)) {
                $coveredNames = DB::table('gp_competences')
                    ->whereIn('id', $coveredSkillIds)
                    ->pluck('nom')
                    ->toArray();
            }
            if (!empty($remainingGapIds)) {
                $missingNames = DB::table('gp_competences')
                    ->whereIn('id', array_slice($remainingGapIds, 0, 3))
                    ->pluck('nom')
                    ->toArray();
            }
        }

        // Calculate coverage score (0-60 points)
        $coverageRate = 0;
        $coverageScore = 0;
        if ($skillGapCount > 0) {
            $coverageRate = $coveredCount / $skillGapCount;
            $coverageScore = (int) round($coverageRate * 60);
            $score += $coverageScore;

            if ($coveredCount > 0) {
                $reasons[] = "✓ Couvre {$coveredCount}/{$skillGapCount} compétences manquantes";
                foreach ($coveredNames as $name) {
                    $reasons[] = "  ✔ {$name}";
                }
            }
            if (count($remainingGapIds) > 0) {
                foreach (array_slice($missingNames, 0, 2) as $name) {
                    $reasons[] = "  ⚠ Reste à acquérir: {$name}";
                }
                if (count($remainingGapIds) > 2) {
                    $extra = count($remainingGapIds) - 2;
                    $reasons[] = "  + {$extra} autre(s) à développer";
                }
            }
        } else if (!empty($this->formationCompetenceIds)) {
            // No skill gap but formation teaches skills - still relevant for development
            $teachesCount = count($this->formationCompetenceIds);
            $score += 15; // Bonus for proactive skill development
            $reasons[] = "✨ Développement proactif ({$teachesCount} compétences)";
        }

        // ═══════════════════════════════════════════════════════════════
        // BONUS: Domain match (+10)
        // ═══════════════════════════════════════════════════════════════

        $domainMatch = false;
        $posteName = null;
        $posteDomaine = null;
        if ($emp->poste_id && $this->domaineLower !== '' && $this->hasGpPostes) {
            $poste = DB::table('gp_postes')->where('id', $emp->poste_id)->first();
            if ($poste) {
                $posteName = $poste->nom ?? null;
                $posteDomaine = isset($poste->domaine) ? trim($poste->domaine) : null;
                
                // Primary match: exact domain comparison
                if ($posteDomaine && strtolower($posteDomaine) === $this->domaineLower) {
                    $domainMatch = true;
                }
                // Fallback: name-based fuzzy match (for postes without domain)
                elseif (!$posteDomaine && $posteName &&
                    (stripos($posteName, $this->domaineLower) !== false ||
                     stripos($this->domaineLower, strtolower($posteName)) !== false)) {
                    $domainMatch = true;
                }
            }
        }
        if ($domainMatch) {
            $score += 10;
            $reasons[] = "Domaine aligné avec le poste: {$posteName}";
        }

        // ═══════════════════════════════════════════════════════════════
        // BONUS: No recent training in domain (+10)
        // ═══════════════════════════════════════════════════════════════

        $hasRecentDomain = isset($this->recentDomainByEmployee[(int) $emp->id]);
        if (!$hasRecentDomain && $this->domaineLower !== '') {
            $score += 10;
            $domaineLabel = $this->formation->domaine ?? $this->domaineLower;
            $reasons[] = "Aucune formation {$domaineLabel} récente";
        }

        // ═══════════════════════════════════════════════════════════════
        // BONUS: Low formation count (+10)
        // ═══════════════════════════════════════════════════════════════

        if ($formationsCount < 3) {
            $score += 10;
            $reasons[] = $formationsCount === 0
                ? '✨ Nouveau candidat (aucune formation)'
                : "Peu de formations suivies ({$formationsCount})";
        }

        // ═══════════════════════════════════════════════════════════════
        // ATTENDANCE BONUS/PENALTY (±20/-15)
        // ═══════════════════════════════════════════════════════════════

        $attendanceRate = $this->attendanceRateByEmployee[(int) $emp->id] ?? null;
        if ($attendanceRate !== null) {
            if ($attendanceRate >= 80) {
                $score += 20;
                $reasons[] = "✓ Excellent taux d'assiduité ({$attendanceRate}%)";
            } elseif ($attendanceRate >= 60 && $attendanceRate < 80) {
                $reasons[] = "Assiduité moyenne ({$attendanceRate}%)";
            } elseif ($attendanceRate < 60) {
                $score -= 15;
                $reasons[] = "⚠️ Historique d'absences ({$attendanceRate}%)";
            }
        }

        // Time since last formation
        $daysSince = null;
        $monthsSince = null;
        $timeSinceLabel = null;
        
        if ($lastDate) {
            $lastCarbon = Carbon::parse($lastDate);
            $daysSince = (int) $lastCarbon->diffInDays(Carbon::now());
            $monthsSince = (int) $lastCarbon->diffInMonths(Carbon::now());
            
            if ($daysSince < 30) {
                $timeSinceLabel = $daysSince === 0 
                    ? "aujourd'hui" 
                    : ($daysSince === 1 ? '1 jour' : "{$daysSince} jours");
            } else {
                $timeSinceLabel = $monthsSince === 1 ? '1 mois' : "{$monthsSince} mois";
            }
        }

        // Calculate final score
        $finalScore = max(0, min($score, 100));
        
        // Determine priority level
        $priorite = 'Haute priorité';
        $prioriteColor = 'success';
        if ($finalScore < 30) {
            $priorite = 'Faible priorité';
            $prioriteColor = 'danger';
        } elseif ($finalScore < 60) {
            $priorite = 'Priorité moyenne';
            $prioriteColor = 'warning';
        }

        // Add explanation for low scores
        if ($finalScore < 30 && $skillGapCount === 0) {
            $reasons[] = "💡 Pas de lacune identifiée pour ce poste";
        } elseif ($finalScore < 30 && $coveredCount === 0 && $skillGapCount > 0) {
            $reasons[] = "💡 Cette formation ne couvre pas les compétences requises";
        }

        // ═══════════════════════════════════════════════════════════════
        // STRUCTURED OUTPUT (same format as postes suggestions)
        // ═══════════════════════════════════════════════════════════════

        return [
            // Identité du candidat
            'id'         => (int) $emp->id,
            'nom'        => $emp->nom ?? '',
            'prenom'     => $emp->prenom ?? '',
            'name'       => trim(($emp->nom ?? '') . ' ' . ($emp->prenom ?? '')),
            'matricule'  => $emp->matricule,
            
            // Section 1: Pertinence du poste
            'pertinence_poste' => [
                'poste_actuel'     => $posteName ?? 'Non assigné',
                'domaine'          => $posteDomaine ?? ($deptNames[0] ?? '—'),
                'departement'      => $deptNames[0] ?? '—',
                'domaine_match'    => $domainMatch,
            ],
            
            // Section 2: Impact sur les compétences
            'impact_competences' => [
                'couverture'           => $skillGapCount > 0 ? (int) round($coverageRate * 100) : 0,
                'couverture_label'     => $skillGapCount > 0 
                    ? (int) round($coverageRate * 100) . '%'
                    : 'N/A',
                'total_gap'            => $skillGapCount,
                'skills_covered'       => $coveredCount,
                'competences_couvertes'=> $coveredNames,
                'competences_restantes'=> $missingNames,
                'remaining_count'      => count($remainingGapIds),
            ],
            
            // Section 3: Profil du candidat
            'profil_candidat' => [
                'formations'           => $formationsCount,
                'derniere_formation'   => $timeSinceLabel ?? 'Aucune',
                'last_training_date'   => $lastDate,
                'jours_depuis'         => $daysSince,
                'mois_depuis'          => $monthsSince,
                'assiduite'            => $attendanceRate,
                'assiduite_label'      => $attendanceRate !== null 
                    ? $attendanceRate . '%' 
                    : 'N/A',
            ],
            
            // Section 4: Score global
            'score_global' => [
                'score'         => $finalScore,
                'max'           => 100,
                'label'         => $finalScore . '/100',
                'priorite'      => $priorite,
                'priorite_color'=> $prioriteColor,
            ],
            
            // Legacy fields (backward compatibility)
            'score'          => $finalScore,
            'reasons'        => $reasons ?: ['Profil compatible'],
            'department'     => $deptNames[0] ?? '—',
            'job_title'      => $posteName,
            'coverage_rate'  => $skillGapCount > 0 ? round($coverageRate * 100, 1) : null,
            'domain_match'   => $domainMatch,
            'attendance_rate'=> $attendanceRate,
        ];
    }
}
