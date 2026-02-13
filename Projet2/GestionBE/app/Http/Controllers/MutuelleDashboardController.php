<?php

namespace App\Http\Controllers;

use App\Models\AffiliationMutuelle;
use App\Models\MutuelleOperation;
use Illuminate\Http\Request;

class MutuelleDashboardController extends Controller
{
    public function dashboardStats()
    {
        // Defaults
        $defaults = [
            'totalAffiliations'      => 0,
            'activeAffiliations'     => 0,
            'inactiveAffiliations'   => 0,
            'pendingDeclarations'    => 0,
            'totalSalaryMonth'       => 0,
            'totalCnssAmountMonth'   => 0,
            'recentAffiliations'     => [],
            'lastDeclarations'       => [],
            'lastOperations'         => [],
            'declarationStatusStats' => [
                ['status' => 'EN_ATTENTE', 'count' => 0],
                ['status' => 'DECLARE', 'count' => 0],
                ['status' => 'PAYE', 'count' => 0],
            ],
            'kpis' => [
                'affiliations_actives'   => 0,
                'affiliations_inactives' => 0,
                'dossiers_en_cours'      => 0,
                'dossiers_termines'      => 0,
            ],
            'distribution' => [
                'EN_COURS'  => 0,
                'TERMINEE'  => 0,
                'ANNULEE'   => 0,
                'total'     => 0,
            ],
        ];

        try {
            // KPI counts
            $totalAffiliations    = AffiliationMutuelle::count();
            $activeAffiliations   = AffiliationMutuelle::where('statut', 'ACTIVE')->count();
            $inactiveAffiliations = AffiliationMutuelle::where('statut', 'RESILIE')->count();

            // Operations status counts
            $opsEnCours  = MutuelleOperation::where('statut', 'EN_COURS')->count();
            $opsTerminee = MutuelleOperation::where('statut', 'TERMINEE')->count();
            $opsAnnulee  = MutuelleOperation::where('statut', 'ANNULEE')->count();
            $opsRembourse = MutuelleOperation::where('statut', 'REMBOURSEE')->count();
            $opsTotal    = $opsEnCours + $opsTerminee + $opsAnnulee;

            // Latest affiliations (5)
            $recentAffiliations = AffiliationMutuelle::with(['employe:id,nom,prenom,matricule'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'employe_id', 'date_adhesion', 'statut', 'created_at'])
                ->map(function ($a) {
                    return [
                        'employe' => $a->employe ? [
                            'nom'       => $a->employe->nom,
                            'prenom'    => $a->employe->prenom,
                            'matricule' => $a->employe->matricule,
                        ] : null,
                        'date_affiliation' => $a->date_adhesion,
                        'statut'           => $a->statut,
                    ];
                })
                ->toArray();

            // Latest operations (5)
            $lastOperations = MutuelleOperation::with(['affiliation.employe:id,nom,prenom,matricule'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'affiliation_id', 'date_operation', 'type_operation', 'statut', 'created_at'])
                ->map(function ($d) {
                    $emp = optional(optional($d->affiliation)->employe);
                    return [
                        'date_operation' => $d->date_operation,
                        'type_operation' => $d->type_operation,
                        'statut'         => $d->statut,
                        'employe'        => $emp ? [
                            'nom'       => $emp->nom,
                            'prenom'    => $emp->prenom,
                            'matricule' => $emp->matricule,
                        ] : null,
                    ];
                })
                ->toArray();

            // Declarations not modeled separately in current data -> default arrays
            $lastDeclarations = [];

            // Status distribution for dashboard (MutuelleOperation statut)
            $distribution = [
                'EN_COURS'  => $opsEnCours,
                'TERMINEE'  => $opsTerminee,
                'ANNULEE'   => $opsAnnulee,
                'total'     => $opsTotal,
            ];

            return response()->json([
                'totalAffiliations'      => $totalAffiliations,
                'activeAffiliations'     => $activeAffiliations,
                'inactiveAffiliations'   => $inactiveAffiliations,
                'pendingDeclarations'    => 0,
                'totalSalaryMonth'       => 0,
                'totalCnssAmountMonth'   => 0,
                'recentAffiliations'     => $recentAffiliations,
                'lastDeclarations'       => $lastDeclarations,
                'lastOperations'         => $lastOperations,
                'declarationStatusStats' => [],
                'recentDossiers'         => $lastOperations,
                'latest_affiliations'    => $recentAffiliations,
                'latest_dossiers'        => $lastOperations,
                'distribution'           => $distribution,
                'statusBreakdown'        => $distribution,
                'kpis' => [
                    'affiliations_actives'   => $activeAffiliations,
                    'affiliations_inactives' => $inactiveAffiliations,
                    'dossiers_en_cours'      => $opsEnCours,
                    'dossiers_termines'      => $opsTerminee,
                ],
            ]);
        } catch (\Throwable $e) {
            // Fallback to defaults on any error
            return response()->json($defaults);
        }
    }
}
