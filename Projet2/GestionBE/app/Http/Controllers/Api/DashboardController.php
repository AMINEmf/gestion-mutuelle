<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    private const GRADE_LABEL_SQL = "COALESCE(NULLIF(TRIM(g.code), ''), NULLIF(TRIM(g.label), ''), 'Non défini')";
    private const EVOLUTION_LABEL_SQL = "COALESCE(NULLIF(TRIM(type_evolution), ''), 'Non spécifié')";
    private const FORMATION_STATUS_LABEL_SQL = "COALESCE(NULLIF(TRIM(statut), ''), 'Non spécifié')";
    private const DOMAINE_LABEL_SQL = "COALESCE(NULLIF(TRIM(f.domaine), ''), 'Non spécifié')";

    public function carrieres(): JsonResponse
    {
        $validStatus = 'Validé';

        $totalEmployes = (int) DB::table('gp_employe_poste_historiques')
            ->where('statut', $validStatus)
            ->distinct('employe_id')
            ->count('employe_id');

        if ($totalEmployes === 0) {
            $totalEmployes = (int) DB::table('gp_employe_poste_historiques')
                ->distinct('employe_id')
                ->count('employe_id');
        }

        $promotions = (int) DB::table('gp_employe_poste_historiques')
            ->where('statut', $validStatus)
            ->where('type_evolution', 'Promotion')
            ->count();

        $postesOccupes = (int) DB::table('gp_employe_poste_historiques')
            ->where('statut', $validStatus)
            ->whereNull('date_fin')
            ->whereNotNull('poste_id')
            ->distinct('poste_id')
            ->count('poste_id');

        if ($postesOccupes === 0) {
            $postesOccupes = (int) DB::table('gp_employe_poste_historiques')
                ->where('statut', $validStatus)
                ->whereNotNull('poste_id')
                ->distinct('poste_id')
                ->count('poste_id');
        }

        $gradesDistincts = (int) DB::table('gp_employe_poste_historiques')
            ->where('statut', $validStatus)
            ->whereNotNull('grade_id')
            ->distinct('grade_id')
            ->count('grade_id');

        $mobilitesTotal = (int) DB::table('demandes_mobilite')->count();
        $mobilitesAcceptees = (int) DB::table('demandes_mobilite')->where('statut', 'Acceptée')->count();
        $mobilitesRefusees = (int) DB::table('demandes_mobilite')->where('statut', 'Refusée')->count();

        $monthLabels = [];
        $monthData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->startOfMonth()->subMonths($i);
            $monthLabels[] = $date->locale('fr')->isoFormat('MMM');

            $count = (int) DB::table('gp_employe_poste_historiques')
                ->where('statut', $validStatus)
                ->where('type_evolution', 'Promotion')
                ->whereYear('date_debut', (int) $date->format('Y'))
                ->whereMonth('date_debut', (int) $date->format('m'))
                ->count();

            $monthData[] = $count;
        }

        $grades = DB::table('gp_employe_poste_historiques as h')
            ->leftJoin('gp_grades as g', 'g.id', '=', 'h.grade_id')
            ->selectRaw(self::GRADE_LABEL_SQL . " as label, COUNT(*) as value")
            ->where('h.statut', $validStatus)
            ->whereNull('h.date_fin')
            ->groupByRaw(self::GRADE_LABEL_SQL)
            ->orderBy('label')
            ->get()
            ->values()
            ->map(fn ($row, $index) => [
                'id' => $index,
                'label' => $row->label,
                'value' => (int) $row->value,
            ]);

        if ($grades->isEmpty()) {
            $grades = DB::table('gp_employe_poste_historiques as h')
                ->leftJoin('gp_grades as g', 'g.id', '=', 'h.grade_id')
                ->selectRaw(self::GRADE_LABEL_SQL . " as label, COUNT(*) as value")
                ->where('h.statut', $validStatus)
                ->groupByRaw(self::GRADE_LABEL_SQL)
                ->orderBy('label')
                ->get()
                ->values()
                ->map(fn ($row, $index) => [
                    'id' => $index,
                    'label' => $row->label,
                    'value' => (int) $row->value,
                ]);
        }

        $evolutionTypes = DB::table('gp_employe_poste_historiques')
            ->selectRaw(self::EVOLUTION_LABEL_SQL . " as label, COUNT(*) as value")
            ->where('statut', $validStatus)
            ->groupByRaw(self::EVOLUTION_LABEL_SQL)
            ->orderByDesc('value')
            ->limit(5)
            ->get()
            ->values()
            ->map(fn ($row, $index) => [
                'id' => $index,
                'label' => $row->label,
                'value' => (int) $row->value,
            ]);

        return response()->json([
            'kpis' => [
                'total_employes' => $totalEmployes,
                'promotions' => $promotions,
                'postes_occupes' => $postesOccupes,
                'grades_distincts' => $gradesDistincts,
                'mobilites_total' => $mobilitesTotal,
                'mobilites_acceptees' => $mobilitesAcceptees,
                'mobilites_refusees' => $mobilitesRefusees,
            ],
            'charts' => [
                'month_labels' => $monthLabels,
                'month_data' => $monthData,
                'grades' => $grades,
                'evolution_types' => $evolutionTypes,
            ],
        ]);
    }

    public function formations(): JsonResponse
    {
        $formationsActives = (int) DB::table('formations')
            ->where('statut', 'En cours')
            ->count();

        $participantsTotal = (int) DB::table('formation_participants')->count();

        $totalFormations = (int) DB::table('formations')->count();
        $formationsTerminees = (int) DB::table('formations')
            ->whereIn('statut', ['Terminée', 'Termine'])
            ->count();

        $tauxReussite = $totalFormations > 0
            ? (int) round(($formationsTerminees / $totalFormations) * 100)
            : 0;

        $budgetTotal = (float) DB::table('formations')->sum('budget');

        $demandesFormationTotal = (int) DB::table('demandes_formation')->count();
        $demandesEnEtude = (int) DB::table('demandes_formation')->where('statut', 'En étude')->count();
        $demandesValidees = (int) DB::table('demandes_formation')->where('statut', 'Validée')->count();

        $statusRows = DB::table('formations')
            ->selectRaw(self::FORMATION_STATUS_LABEL_SQL . " as label, COUNT(*) as value")
            ->groupByRaw(self::FORMATION_STATUS_LABEL_SQL)
            ->orderByDesc('value')
            ->get();

        $byStatus = $statusRows
            ->values()
            ->map(fn ($row, $index) => [
                'id' => $index,
                'label' => $row->label,
                'value' => (int) $row->value,
            ]);

        $monthLabels = [];
        $monthData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->startOfMonth()->subMonths($i);
            $monthLabels[] = $date->locale('fr')->isoFormat('MMM');

            $sumBudget = (float) DB::table('formations')
                ->whereYear('date_debut', (int) $date->format('Y'))
                ->whereMonth('date_debut', (int) $date->format('m'))
                ->sum('budget');

            $monthData[] = $sumBudget;
        }

        $domaineRows = DB::table('formations as f')
            ->leftJoin('formation_participants as fp', 'fp.formation_id', '=', 'f.id')
            ->selectRaw(self::DOMAINE_LABEL_SQL . " as label, COUNT(fp.id) as value")
            ->groupByRaw(self::DOMAINE_LABEL_SQL)
            ->orderByDesc('value')
            ->limit(6)
            ->get();

        $domaineData = $domaineRows
            ->values()
            ->map(fn ($row) => [
                'label' => $row->label,
                'value' => (int) $row->value,
            ]);

        return response()->json([
            'kpis' => [
                'formations_actives' => $formationsActives,
                'participants_total' => $participantsTotal,
                'taux_reussite' => $tauxReussite,
                'budget_total' => $budgetTotal,
                'demandes_formation_total' => $demandesFormationTotal,
                'demandes_en_etude' => $demandesEnEtude,
                'demandes_validees' => $demandesValidees,
            ],
            'charts' => [
                'month_labels' => $monthLabels,
                'month_data' => $monthData,
                'by_status' => $byStatus,
                'domaine_data' => $domaineData,
            ],
        ]);
    }
}
