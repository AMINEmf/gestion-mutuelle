<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use App\Models\Employe;
use App\Models\MutuelleOperation;
use App\Models\MutuelleDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MutuelleDossierController extends Controller
{
    public function index(Request $request)
    {
        $departementId = $request->get('departement_id');
        
        // Si aucun département n'est sélectionné, on retourne une liste vide
        // pour éviter de charger tous les dossiers (comportement demandé).
        if (empty($departementId)) {
            return response()->json([
                'success' => true,
                'data' => [],
                'count' => 0
            ]);
        }

        $includeSub = filter_var($request->get('include_sub', false), FILTER_VALIDATE_BOOLEAN);
        
        // Individual filter params
        $nom = $request->get('nom');
        $statut = $request->get('statut');
        $numeroAdherent = $request->get('numero_adherent');
        $numeroDossier = $request->get('numero_dossier');

        $query = MutuelleOperation::query()
            ->join('affiliations_mutuelle', 'mutuelle_operations.affiliation_id', '=', 'affiliations_mutuelle.id')
            ->join('employes', 'affiliations_mutuelle.employe_id', '=', 'employes.id')
            ->leftJoin('departements', 'employes.departement_id', '=', 'departements.id')
            ->select(
                'mutuelle_operations.numero_dossier',
                'affiliations_mutuelle.numero_adherent',
                'employes.id as employe_id',
                \DB::raw('CONCAT(employes.nom, " ", employes.prenom) as employe_full_name'),
                \DB::raw('COUNT(*) as nb_operations'),
                \DB::raw('(SELECT statut FROM mutuelle_operations mo2 WHERE mo2.numero_dossier = mutuelle_operations.numero_dossier ORDER BY date_operation DESC, id DESC LIMIT 1) as statut_dossier'),
                \DB::raw('(SELECT type_operation FROM mutuelle_operations mo3 WHERE mo3.numero_dossier = mutuelle_operations.numero_dossier ORDER BY date_operation DESC, id DESC LIMIT 1) as derniere_operation_type'),
                \DB::raw('(SELECT date_operation FROM mutuelle_operations mo4 WHERE mo4.numero_dossier = mutuelle_operations.numero_dossier ORDER BY date_operation DESC, id DESC LIMIT 1) as derniere_operation_date'),
                \DB::raw('(SELECT commentaire FROM mutuelle_operations mo5 WHERE mo5.numero_dossier = mutuelle_operations.numero_dossier ORDER BY date_operation DESC, id DESC LIMIT 1) as commentaire_dossier')
            )
            ->groupBy(
                'mutuelle_operations.numero_dossier',
                'affiliations_mutuelle.numero_adherent',
                'employes.id',
                'employes.nom',
                'employes.prenom'
            );

        if ($departementId) {
            $departmentIds = [$departementId];
            if ($includeSub) {
                $departmentIds = array_merge($departmentIds, $this->getDescendantDepartments($departementId));
            }
            $query->whereIn('employes.departement_id', array_unique($departmentIds));
        }

        // Filter by nom (employe nom/prenom)
        if ($nom) {
            $query->where(function($q) use ($nom) {
                $q->where('employes.nom', 'like', "%{$nom}%")
                  ->orWhere('employes.prenom', 'like', "%{$nom}%");
            });
        }

        // Filter by numero_adherent
        if ($numeroAdherent) {
            $query->where('affiliations_mutuelle.numero_adherent', 'like', "%{$numeroAdherent}%");
        }

        // Filter by numero_dossier
        if ($numeroDossier) {
            $query->where('mutuelle_operations.numero_dossier', 'like', "%{$numeroDossier}%");
        }

        // Filter by statut (computed field, use HAVING)
        if ($statut && $statut !== 'ALL') {
            $query->having('statut_dossier', '=', $statut);
        }

        $dossiers = $query->orderBy('derniere_operation_date', 'desc')->get();

        return response()->json($dossiers);
    }

    public function show($numero_dossier)
    {
        // On charge l'affiliation
        $operations = MutuelleOperation::with(['affiliation', 'affiliation.mutuelle', 'affiliation.regime', 'documents'])
            ->where('numero_dossier', $numero_dossier)
            ->orderBy('date_operation', 'desc')
            ->get();

        if ($operations->isEmpty()) {
            return response()->json(['message' => 'Dossier non trouvé'], 404);
        }

        // Infos dossier : on cherche une opération avec une affiliation valide
        $firstOp = $operations->first(function($op) {
            return $op->affiliation !== null;
        });

        // Fallback si vraiment rien de trouvé (cas rare de données orphelines)
        if (!$firstOp) {
             return response()->json(['message' => 'Données affiliation manquantes pour ce dossier'], 404);
        }

        $employe = $firstOp->affiliation->employe;
        
        if (!$employe) {
            return response()->json(['message' => 'Employé introuvable'], 404);
        }
        
        $header = [
            'numero_dossier' => $numero_dossier,
            'numero_adherent' => $firstOp->affiliation->numero_adherent,
            'employe' => [
                'id' => $employe->id,
                'matricule' => $employe->matricule,
                'nom' => $employe->nom,
                'prenom' => $employe->prenom,
                'departement' => $employe->departement?->nom
            ],
            'montants' => [
                'total' => $operations->sum('montant_total'),
                'rembourse' => $operations->sum('montant_rembourse'),
                'reste' => $operations->sum('reste_a_charge'),
            ]
        ];

        // Récupérer tous les documents liés aux opérations de ce dossier (flattened)
        $documents = $operations->flatMap(function($operation) {
            return $operation->documents;
        });

        return response()->json([
            'header' => $header,
            'operations' => $operations,
            'documents' => $documents
        ]);
    }

    private function getDescendantDepartments(int $departementId): array
    {
        $ids = [];
        $children = Departement::where('parent_id', $departementId)->pluck('id')->toArray();

        foreach ($children as $childId) {
            $ids[] = $childId;
            $ids = array_merge($ids, $this->getDescendantDepartments($childId));
        }

        return $ids;
    }
}
