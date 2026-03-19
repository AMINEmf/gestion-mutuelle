<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePosteRequest;
use App\Http\Requests\UpdatePosteCompetencesRequest;
use App\Http\Requests\UpdatePosteRequest;
use App\Models\Poste;
use App\Models\Service;
use App\Models\Unite;
use App\Models\Departement;
use App\Models\Employe;
use App\Models\GpEmployePosteHistorique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PosteController extends Controller
{
    private function resolveGradeLevel($grade): ?int
    {
        if (!$grade) return null;
        $code = $grade->code ?? $grade->label ?? $grade->name ?? null;
        if ($code && preg_match('/(\d+)/', $code, $matches)) {
            return (int) $matches[1];
        }
        return isset($grade->id) ? (int) $grade->id : null;
    }

    private function computeGradeScore(?int $posteLevel, ?int $employeeLevel): int
    {
        if ($posteLevel === null || $employeeLevel === null) return 0;
        $diff = abs($posteLevel - $employeeLevel);
        if ($diff === 0) return 20;
        if ($diff === 1) return 15;
        if ($diff === 2) return 10;
        if ($diff === 3) return 5;
        return 0;
    }

    private function computeTenureScore($dateValue): int
    {
        if (!$dateValue) return 0;
        try {
            $start = Carbon::parse($dateValue);
        } catch (\Exception $e) {
            return 0;
        }
        $years = $start->diffInYears(now());
        if ($years >= 5) return 10;
        if ($years >= 3) return 7;
        if ($years >= 1) return 4;
        return 1;
    }
    
    private function formatTenure($dateValue): string
    {
        if (!$dateValue) return 'N/A';
        try {
            $start = Carbon::parse($dateValue);
            $years = $start->diffInYears(now());
            $months = $start->diffInMonths(now()) % 12;
            
            if ($years >= 1) {
                return $years . ' an' . ($years > 1 ? 's' : '') . ($months > 0 ? ' ' . $months . ' mois' : '');
            }
            return $months . ' mois';
        } catch (\Exception $e) {
            return 'N/A';
        }
    }
    
    public function index(Request $request)
    {
        // Optimized query using direct DB query with joins
        $query = DB::table('gp_postes')
            ->leftJoin('gp_grades', 'gp_postes.grade_id', '=', 'gp_grades.id')
            ->leftJoin('gp_unites', 'gp_postes.unite_id', '=', 'gp_unites.id')
            ->leftJoin('departements', 'gp_unites.departement_id', '=', 'departements.id')
            ->select(
                'gp_postes.*',
                'gp_grades.code as grade_code',
                'gp_grades.label as grade_label',
                'gp_grades.description as grade_description',
                'gp_unites.nom as unite_nom',
                'gp_unites.departement_id',
                'departements.nom as departement_nom'
            );

        $search = $request->query('search', $request->query('q'));
        if ($search) {
            $query->where('gp_postes.nom', 'like', "%{$search}%");
        }

        if ($departementId = $request->query('departement_id')) {
            $query->where('gp_unites.departement_id', $departementId);
        }
        elseif ($uniteId = $request->query('unite_id')) {
            $query->where('gp_postes.unite_id', $uniteId);
        }

        if ($gradeId = $request->query('grade_id')) {
            $query->where('gp_postes.grade_id', $gradeId);
        }

        if ($statut = $request->query('statut')) {
            $query->where('gp_postes.statut', $statut);
        }

        $results = $query->get();
        
        // Get all poste IDs
        $posteIds = $results->pluck('id')->toArray();
        
        // Load all competences for these postes in one query
        $competencesData = DB::table('gp_poste_competence')
            ->join('gp_competences', 'gp_poste_competence.competence_id', '=', 'gp_competences.id')
            ->whereIn('gp_poste_competence.poste_id', $posteIds)
            ->select(
                'gp_poste_competence.poste_id',
                'gp_competences.id as competence_id',
                'gp_competences.nom',
                'gp_competences.description',
                'gp_poste_competence.niveau_requis',
                'gp_poste_competence.is_required'
            )
            ->get()
            ->groupBy('poste_id');

        // Transform results to include grade, unite, and competences
        $postes = $results->map(function ($poste) use ($competencesData) {
            $competences = $competencesData->get($poste->id, collect([]))->map(function ($comp) {
                return [
                    'id' => $comp->competence_id,
                    'nom' => $comp->nom,
                    'description' => $comp->description,
                    'pivot' => [
                        'niveau_requis' => $comp->niveau_requis,
                        'is_required' => $comp->is_required,
                    ]
                ];
            })->values()->toArray();
            
            return [
                'id' => $poste->id,
                'nom' => $poste->nom,
                'description' => $poste->description,
                'statut' => $poste->statut,
                'niveau' => $poste->niveau,
                'domaine' => $poste->domaine,
                'unite_id' => $poste->unite_id,
                'grade_id' => $poste->grade_id,
                'departement_id' => $poste->departement_id,
                'created_at' => $poste->created_at,
                'updated_at' => $poste->updated_at,
                'competences_count' => count($competences),
                'competences' => $competences,
                'grade' => $poste->grade_id ? [
                    'id' => $poste->grade_id,
                    'code' => $poste->grade_code,
                    'label' => $poste->grade_label,
                    'description' => $poste->grade_description,
                ] : null,
                'unite' => $poste->unite_id ? [
                    'id' => $poste->unite_id,
                    'nom' => $poste->unite_nom,
                    'departement_id' => $poste->departement_id,
                ] : null,
                'departement' => $poste->departement_id ? [
                    'id' => $poste->departement_id,
                    'nom' => $poste->departement_nom,
                ] : null,
            ];
        });

        $perPage = (int)$request->query('per_page', 0);
        if ($perPage > 0) {
            // For pagination, would need to implement manually
            // For now, return all results
            return response()->json($postes);
        }

        return response()->json($postes);
    }

    public function show($id)
    {
        $poste = Poste::with(['grade', 'competences'])->findOrFail($id);

        return response()->json($poste);
    }

    public function store(StorePosteRequest $request)
    {
        $data = $request->validated();

        // Si unite_id est manquant mais departement_id est présent
        if (!isset($data['unite_id']) && isset($data['departement_id'])) {
            $departementId = $data['departement_id'];

            // Trouver la première unité de ce département
            $unite = Unite::where('departement_id', $departementId)->first();

            if (!$unite) {
                // Créer un service par défaut si inexistant
                $service = Service::where('departement_id', $departementId)->first();
                if (!$service) {
                    $departement = Departement::find($departementId);
                    $service = Service::create([
                        'nom' => 'Service ' . ($departement->nom ?? 'Defaut'),
                        'departement_id' => $departementId
                    ]);
                }

                // Créer une unité par défaut
                $unite = Unite::create([
                    'nom' => 'Unité ' . ($service->nom ?? 'Defaut'),
                    'service_id' => $service->id,
                    'departement_id' => $departementId
                ]);
            }

            $data['unite_id'] = $unite->id;
        }

        // Vérification finale
        if (!isset($data['unite_id'])) {
            return response()->json(['message' => 'L\'unité ou le département est requis.'], 422);
        }

        $poste = DB::transaction(function () use ($data) {
            return Poste::create($data);
        });

        return response()->json($poste, 201);
    }

    public function update(UpdatePosteRequest $request, $id)
    {
        $poste = Poste::findOrFail($id);
        $data = $request->validated();

        // Si unite_id est absent mais departement_id est fourni
        if (!isset($data['unite_id']) && isset($data['departement_id'])) {
            $departementId = $data['departement_id'];
            $unite = Unite::where('departement_id', $departementId)->first();

            if (!$unite) {
                $service = Service::where('departement_id', $departementId)->first();
                if (!$service) {
                    $departement = Departement::find($departementId);
                    $service = Service::create([
                        'nom' => 'Service ' . ($departement->nom ?? 'Defaut'),
                        'departement_id' => $departementId
                    ]);
                }
                $unite = Unite::create([
                    'nom' => 'Unité ' . ($service->nom ?? 'Defaut'),
                    'service_id' => $service->id,
                    'departement_id' => $departementId
                ]);
            }
            $data['unite_id'] = $unite->id;
        }

        DB::transaction(function () use ($poste, $data) {
            $poste->update($data);
        });

        return response()->json($poste);
    }

    public function destroy($id)
    {
        $poste = Poste::findOrFail($id);
        DB::transaction(function () use ($poste) {
            $poste->competences()->detach();
            $poste->delete();
        });

        return response()->json(null, 204);
    }

    public function aiSuggestions(Request $request, $id)
    {
        $poste = Poste::with(['competences', 'grade', 'unite.service'])->findOrFail($id);
        $departementId =
            $poste->departement_id
            ?? optional($poste->unite)->departement_id
            ?? optional(optional($poste->unite)->service)->departement_id;

        $requiredCompetences = $poste->competences ?? collect();
        $requiredItems = $requiredCompetences->map(function ($comp) {
            return [
                'id' => $comp->id,
                'nom' => $comp->nom,
                'niveau_requis' => (int) ($comp->pivot->niveau_requis ?? 0),
            ];
        });
        $requiredIds = $requiredItems->pluck('id')->all();
        $requiredCount = $requiredItems->count();

        $baseQuery = Employe::with(['competences', 'poste.grade', 'departements', 'historiquePostes.poste', 'historiquePostes.grade', 'formations'])
            ->where(function ($q) {
                $q->whereNull('active')->orWhere('active', 1);
            })
            ->where(function ($q) use ($poste) {
                $q->whereNull('poste_id')->orWhere('poste_id', '!=', $poste->id);
            });

        $employeesQuery = (clone $baseQuery);
        if ($departementId) {
            $employeesQuery->where(function ($q) use ($departementId) {
                $q->where('departement_id', $departementId)
                    ->orWhereHas('departements', function ($sub) use ($departementId) {
                        $sub->where('departement_id', $departementId);
                    });
            });
        }

        $employees = $employeesQuery->get();

        if ($departementId && $employees->isEmpty()) {
            $employees = $baseQuery->get();
        }

        $posteGradeLevel = $this->resolveGradeLevel($poste->grade);
        $posteGradeId = $poste->grade_id;

        $suggestions = $employees->map(function ($employee) use (
            $requiredCompetences,
            $requiredItems,
            $requiredIds,
            $requiredCount,
            $departementId,
            $posteGradeLevel,
            $posteGradeId
        ) {
            $employeeCompetences = $employee->competences->keyBy('id');
            $employeeCompetenceIds = $employeeCompetences->keys()->all();
            $unit = $requiredCount > 0 ? (60 / $requiredCount) : 0;
            $scoreSum = 0;
            $matchedCompetencesCount = 0;
            
            foreach ($requiredItems as $req) {
                $empComp = $employeeCompetences->get($req['id']);
                $empLevel = $empComp?->pivot?->niveau ?? $empComp?->pivot?->niveau_acquis ?? 0;
                $reqLevel = (int) ($req['niveau_requis'] ?? 0);

                if ($empLevel >= $reqLevel) {
                    $scoreSum += $unit;
                    $matchedCompetencesCount++;
                } elseif ($reqLevel > 0 && $empLevel === ($reqLevel - 1)) {
                    $scoreSum += ($unit * 0.5);
                }
            }
            $competenceScore = (int) round($scoreSum);

            $employeeGrade = $employee->poste->grade ?? null;
            $employeeGradeId = $employee->poste->grade_id ?? null;
            $employeeGradeLevel = $this->resolveGradeLevel($employeeGrade);
            $gradeScore = 0;
            if ($posteGradeId && $employeeGradeId && $posteGradeId === $employeeGradeId) {
                $gradeScore = 20;
            } else {
                $gradeScore = $this->computeGradeScore($posteGradeLevel, $employeeGradeLevel);
            }

            $tenureScore = $this->computeTenureScore($employee->date_embauche ?? $employee->date_entree ?? null);

            // Logique améliorée : Si le poste requiert des compétences, l'employé DOIT en avoir
            if ($requiredCount > 0) {
                // Si aucune compétence n'est validée, score = 0
                if ($competenceScore === 0) {
                    $globalScore = 0;
                } else {
                    // Si l'ancienneté dépasse les compétences de manière disproportionnée, pénaliser
                    if ($tenureScore > $competenceScore && $competenceScore < 30) {
                        // Quelqu'un avec beaucoup d'ancienneté mais peu de compétences est pénalisé
                        $penalty = min(15, $tenureScore - $competenceScore);
                        $globalScore = max(0, min(100, $competenceScore + $gradeScore + $tenureScore - $penalty));
                    } else {
                        $globalScore = min(100, $competenceScore + $gradeScore + $tenureScore);
                    }
                }
            } else {
                // Pas de compétences requises, calcul normal
                $globalScore = min(100, $competenceScore + $gradeScore + $tenureScore);
            }
            
            $matchLevel = $globalScore >= 70 ? 'high' : ($globalScore >= 40 ? 'medium' : 'low');

            $competenceMatches = [];
            foreach ($requiredItems as $req) {
                $empComp = $employeeCompetences->get($req['id']);
                $empLevel = $empComp?->pivot?->niveau ?? $empComp?->pivot?->niveau_acquis ?? 0;
                $reqLevel = (int) ($req['niveau_requis'] ?? 0);
                $status = $empLevel >= $reqLevel
                    ? 'match'
                    : ($reqLevel > 0 && $empLevel === ($reqLevel - 1) ? 'partial' : 'none');

                $competenceMatches[] = [
                    'skill' => $req['nom'],
                    'required' => true,
                    'employeeHas' => $empLevel > 0,
                    'niveau_requis' => $reqLevel,
                    'niveau_employe' => (int) $empLevel,
                    'match_status' => $status,
                ];
            }

            $extraCompetences = $employee->competences->filter(function ($comp) use ($requiredIds) {
                return !in_array($comp->id, $requiredIds);
            });
            foreach ($extraCompetences as $comp) {
                $competenceMatches[] = [
                    'skill' => $comp->nom,
                    'required' => false,
                    'employeeHas' => true,
                    'niveau_requis' => null,
                    'niveau_employe' => (int) ($comp->pivot->niveau ?? $comp->pivot->niveau_acquis ?? 0),
                    'match_status' => 'extra',
                ];
            }

            $fullName = trim(($employee->nom ?? '') . ' ' . ($employee->prenom ?? ''));
            
            // Calculate derived values
            $currentPosteName = $employee->poste?->nom ?? 'Non assigné';
            $currentPosteDomaine = $employee->poste?->domaine ?? null;
            $deptName = $employee->departements->first()?->nom ?? '—';
            $formationsCount = $employee->formations->count();
            $lastFormation = $employee->formations->sortByDesc('date_debut')->first();
            $lastFormationLabel = $lastFormation 
                ? Carbon::parse($lastFormation->date_debut)->diffForHumans() 
                : 'Aucune';
            
            // Calculate coverage
            $coverageRate = $requiredCount > 0 
                ? (int) round(($matchedCompetencesCount / $requiredCount) * 100) 
                : 0;
            
            // Missing competences (required but not matched)
            $missingCompetences = collect($competenceMatches)
                ->filter(fn($m) => $m['required'] && $m['match_status'] === 'none')
                ->pluck('skill')
                ->values()
                ->toArray();
            
            // Determine priority
            $priorite = 'Haute priorité';
            $prioriteColor = 'success';
            if ($globalScore < 30) {
                $priorite = 'Faible priorité';
                $prioriteColor = 'danger';
            } elseif ($globalScore < 60) {
                $priorite = 'Priorité moyenne';
                $prioriteColor = 'warning';
            }

            return [
                // Identité du candidat
                'id' => $employee->id,
                'employee_id' => $employee->id,
                'nom' => $employee->nom,
                'prenom' => $employee->prenom,
                'name' => $fullName ?: ($employee->nom ?? $employee->prenom ?? 'Employé'),
                'full_name' => $fullName ?: ($employee->nom ?? $employee->prenom ?? 'Employé'),
                'matricule' => $employee->matricule,
                
                // Section 1: Pertinence du poste
                'pertinence_poste' => [
                    'poste_actuel' => $currentPosteName,
                    'domaine' => $currentPosteDomaine ?? $deptName,
                    'departement' => $deptName,
                    'grade_actuel' => $employeeGrade?->label ?? $employeeGrade?->code ?? 'N/A',
                ],
                
                // Section 2: Impact sur les compétences
                'impact_competences' => [
                    'couverture' => $coverageRate,
                    'couverture_label' => $coverageRate . '%',
                    'matched_count' => $matchedCompetencesCount,
                    'required_count' => $requiredCount,
                    'competences_restantes' => $missingCompetences,
                    'remaining_count' => count($missingCompetences),
                ],
                
                // Section 3: Profil du candidat
                'profil_candidat' => [
                    'formations' => $formationsCount,
                    'derniere_formation' => $lastFormationLabel,
                    'anciennete' => $this->formatTenure($employee->date_embauche ?? $employee->date_entree),
                    'grade' => $employeeGrade?->label ?? $employeeGrade?->code ?? 'N/A',
                ],
                
                // Section 4: Score global
                'score_global' => [
                    'score' => $globalScore,
                    'max' => 100,
                    'label' => $globalScore . '/100',
                    'priorite' => $priorite,
                    'priorite_color' => $prioriteColor,
                    'details' => [
                        'competences' => $competenceScore,
                        'grade' => $gradeScore,
                        'anciennete' => $tenureScore,
                    ],
                ],
                
                // Legacy fields (backward compatibility)
                'score' => $globalScore,
                'match_level' => $matchLevel,
                'email' => $employee->email,
                'tel' => $employee->tel,
                'telephone' => $employee->tel,
                'date_embauche' => $employee->date_embauche,
                'date_entree' => $employee->date_entree,
                'type_contrat' => $employee->type_contrat ?? null,
                'departement_id' => $departementId,
                'ai_score_details' => [
                    'competences' => $competenceScore,
                    'grade' => $gradeScore,
                    'tenure' => $tenureScore,
                    'globalScore' => $globalScore,
                    'competencesScore' => $competenceScore,
                    'gradeScore' => $gradeScore,
                    'tenureScore' => $tenureScore,
                ],
                'competences' => $employee->competences->map(function ($comp) {
                    return [
                        'id' => $comp->id,
                        'nom' => $comp->nom,
                        'niveau' => (int) ($comp->pivot->niveau ?? $comp->pivot->niveau_acquis ?? 0),
                    ];
                })->values(),
                'competence_matches' => $competenceMatches,
                'historique_postes' => $employee->historiquePostes->sortByDesc('date_debut')->map(function ($hist) {
                    return [
                        'id' => $hist->id,
                        'poste_nom' => $hist->poste?->nom ?? 'N/A',
                        'grade_label' => $hist->grade?->label ?? $hist->grade?->code ?? 'N/A',
                        'type_evolution' => $hist->type_evolution,
                        'date_debut' => $hist->date_debut,
                        'date_fin' => $hist->date_fin,
                        'statut' => $hist->statut,
                        'duree' => $hist->date_fin 
                            ? Carbon::parse($hist->date_debut)->diffInMonths(Carbon::parse($hist->date_fin)) . ' mois'
                            : 'En cours',
                    ];
                })->values(),
                'formations' => $employee->formations->sortByDesc('date_debut')->map(function ($formation) {
                    return [
                        'id' => $formation->id,
                        'intitule' => $formation->titre ?? $formation->nom ?? 'N/A',
                        'organisme' => $formation->organisme ?? null,
                        'date_debut' => $formation->date_debut,
                        'date_fin' => $formation->date_fin,
                        'duree' => $formation->duree ?? null,
                        'statut' => $formation->statut ?? null,
                    ];
                })->values(),
                'historique' => [],
                'grade' => $employeeGrade ? [
                    'id' => $employeeGrade->id,
                    'code' => $employeeGrade->code ?? null,
                    'label' => $employeeGrade->label ?? null,
                ] : null,
            ];
        });

        $sorted = $suggestions->sortByDesc('score')->values();
        return response()->json($sorted);
    }

    public function getPostesByUnite($id)
    {
        $postes = Poste::where('unite_id', $id)
            ->with(['grade'])
            ->withCount('competences')
            ->get();

        return response()->json($postes);
    }

    public function updateCompetences(UpdatePosteCompetencesRequest $request, $posteId)
    {
        $poste = Poste::findOrFail($posteId);
        $competenceIds = $request->input('competence_ids', []);
        $pivots = $request->input('pivots', []);
        $competencesPayload = $request->input('competences', null);

        $syncData = [];
        if (is_array($competencesPayload) && count($competencesPayload) > 0) {
            foreach ($competencesPayload as $item) {
                if (!isset($item['competence_id'])) {
                    continue;
                }
                $competenceId = $item['competence_id'];
                $pivotData = array_intersect_key(
                    $item,
                    array_flip(['niveau_requis', 'is_required'])
                );
                $syncData[$competenceId] = $pivotData;
            }
        } else {
            foreach ($competenceIds as $competenceId) {
                $pivotData = [];
                if (isset($pivots[$competenceId]) && is_array($pivots[$competenceId])) {
                    $pivotData = array_intersect_key($pivots[$competenceId], array_flip(['niveau_requis', 'is_required']));
                }

                $syncData[$competenceId] = $pivotData;
            }
        }

        DB::transaction(function () use ($poste, $syncData) {
            $poste->competences()->sync($syncData);
        });

        return response()->json($poste->load('competences'));
    }

    public function getCompetences($posteId)
    {
        $poste = Poste::with('competences')->findOrFail($posteId);

        $competences = $poste->competences->map(function ($comp) {
            return [
                'competence_id' => $comp->id,
                'id' => $comp->id,
                'nom' => $comp->nom,
                'niveau_requis' => (int) ($comp->pivot->niveau_requis ?? 0),
            ];
        })->values();

        return response()->json($competences);
    }

    public function assignEmploye(Request $request, $id)
    {
        $request->validate([
            'employee_id' => 'nullable|exists:employes,id',
            'employe_id' => 'nullable|exists:employes,id',
        ]);

        $employeeId = $request->input('employee_id', $request->input('employe_id'));
        if (!$employeeId) {
            return response()->json([
                'message' => 'employee_id est requis.'
            ], 422);
        }

        $poste = Poste::findOrFail($id);
        $employe = Employe::findOrFail($employeeId);

        if ((int)$employe->active === 0) {
            return response()->json([
                'message' => "Impossible d'assigner : l'employé est inactif."
            ], 409);
        }

        if ((int)$employe->poste_id === (int)$poste->id) {
            return response()->json([
                'message' => "L'employé est déjà assigné à ce poste.",
                'employee_id' => $employe->id,
                'poste_id' => $poste->id
            ], 200);
        }

        DB::transaction(function () use ($employe, $poste) {
            $previousPosteId = $employe->poste_id;

            // Clôturer le poste actif si existant
            if ($previousPosteId) {
                GpEmployePosteHistorique::where('employe_id', $employe->id)
                    ->whereNull('date_fin')
                    ->update(['date_fin' => now()->toDateString()]);
            }

            // Mettre à jour le poste actuel de l'employé
            $employe->poste_id = $poste->id;
            $employe->save();

            // Créer une nouvelle ligne d'historique avec type_evolution automatique
            // Context: 'suggestion' car assignEmploye vient des suggestions AI
            GpEmployePosteHistorique::createWithAutoType([
                'employe_id' => $employe->id,
                'poste_id' => $poste->id,
                'grade_id' => $poste->grade_id,
                'date_debut' => now()->toDateString(),
                'date_fin' => null,
                'statut' => 'Proposé',
            ], 'suggestion');
        });

        return response()->json([
            'message' => 'Employé assigné avec succès',
            'employee_id' => $employe->id,
            'poste_id' => $poste->id
        ]);
    }
}
