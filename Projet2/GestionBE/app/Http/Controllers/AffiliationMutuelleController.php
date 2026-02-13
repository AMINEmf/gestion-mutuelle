<?php

namespace App\Http\Controllers;

use App\Models\AffiliationMutuelle;
use App\Models\Employe;
use App\Models\RegimeMutuelle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AffiliationMutuelleController extends Controller
{
    /**
     * GET /api/affiliations-mutuelle
     * Liste des affiliations avec jointures
     */
    public function index(Request $request)
    {
        try {
            $query = AffiliationMutuelle::with([
                'employe:id,matricule,nom,prenom,departement_id,nb_enfants,situation_fm',
                'mutuelle:id,nom',
                'regime:id,libelle,taux_couverture,cotisation_mensuelle,part_employeur_pct,part_employe_pct'
            ]);

            // Filtrer par département si spécifié
            if ($request->has('departement_id') && $request->departement_id) {
                $query->whereHas('employe', function($q) use ($request) {
                    $q->where('departement_id', $request->departement_id);
                });
            }

            // FILTER: Mutuelle
            if ($request->filled('mutuelle_id')) {
                $query->where('mutuelle_id', $request->mutuelle_id);
            }

            // FILTER: Statut
            if ($request->filled('statut')) {
                $query->where('statut', $request->statut);
            }

            // FILTER: Search (Nom/Prénom)
            if ($request->filled('search')) {
                $search = $request->search;
                $query->whereHas('employe', function($q) use ($search) {
                    $q->where('nom', 'LIKE', "%{$search}%")
                      ->orWhere('prenom', 'LIKE', "%{$search}%")
                      ->orWhere('matricule', 'LIKE', "%{$search}%");
                });
            }

            // FILTER: Date Adhésion (Range)
            if ($request->filled('date_adhesion_from')) {
                $query->whereDate('date_adhesion', '>=', $request->date_adhesion_from);
            }
            if ($request->filled('date_adhesion_to')) {
                $query->whereDate('date_adhesion', '<=', $request->date_adhesion_to);
            }

            // FILTER: Date Résiliation (Range)
            if ($request->filled('date_resiliation_from')) {
                $query->whereDate('date_resiliation', '>=', $request->date_resiliation_from);
            }
            if ($request->filled('date_resiliation_to')) {
                $query->whereDate('date_resiliation', '<=', $request->date_resiliation_to);
            }

            $affiliations = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $affiliations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des affiliations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/employes/eligibles-mutuelle
     * Employés éligibles pour affiliation (actifs et non affiliés)
     */
    public function employesEligibles()
    {
        try {
            // On récupère les employés qui sont actifs OU qui n'ont pas de date de sortie
            // (au cas où le flag active serait à 0 par défaut suite à un import)
            $employes = Employe::where(function($q) {
                    $q->where('active', true)
                      ->orWhere('active', 1)
                      ->orWhereNull('date_sortie');
                })
                ->whereDoesntHave('affiliationsMutuelle', function($query) {
                    $query->where('statut', 'ACTIVE');
                })
                ->select('id', 'matricule', 'nom', 'prenom', 'nb_enfants', 'situation_fm')
                ->orderBy('nom')
                ->orderBy('prenom')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $employes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des employés éligibles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/employes/{id}/affiliations-mutuelle
     * Récupérer les affiliations d'un employé spécifique
     */
    public function getByEmploye($employeId)
    {
        try {
            $affiliations = AffiliationMutuelle::with(['mutuelle', 'regime'])
                ->where('employe_id', $employeId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($affiliations);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des affiliations de l\'employé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/affiliations-mutuelle
     * Création d'une nouvelle affiliation
     */
    public function store(Request $request)
    {
        try {
            // Validation des données
            $validated = $request->validate([
                'employe_id' => 'required|exists:employes,id',
                'mutuelle_id' => 'required|exists:mutuelles,id',
                'regime_mutuelle_id' => 'required|exists:regimes_mutuelle,id',
                'numero_adherent' => 'nullable|string|max:50',
                'date_adhesion' => 'required|date',
                'ayant_droit' => 'boolean',
                'conjoint_ayant_droit' => 'boolean',
                'commentaire' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            // Vérifications métier
            $employe = Employe::findOrFail($validated['employe_id']);
            
            // 1) Vérifier que l'employé est actif
            if (!$employe->active) {
                throw new \Exception('L\'employé doit être actif pour être affilié');
            }

            // 2) Vérifier que l'employé n'a pas déjà une affiliation active
            $affiliationExistante = AffiliationMutuelle::where('employe_id', $validated['employe_id'])
                ->where('statut', 'ACTIVE')
                ->exists();

            if ($affiliationExistante) {
                throw new \Exception('Cet employé a déjà une affiliation active');
            }

            // 3) Vérifier que le régime appartient bien à la mutuelle
            $regime = RegimeMutuelle::where('id', $validated['regime_mutuelle_id'])
                ->where('mutuelle_id', $validated['mutuelle_id'])
                ->where('active', true)
                ->first();

            if (!$regime) {
                throw new \Exception('Le régime sélectionné n\'appartient pas à cette mutuelle ou n\'est pas actif');
            }

            // Créer l'affiliation
            $validated['statut'] = 'ACTIVE';
            $affiliation = AffiliationMutuelle::create($validated);

            // Charger les relations pour la réponse
            $affiliation->load(['employe', 'mutuelle', 'regime']);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $affiliation,
                'message' => 'Affiliation créée avec succès'
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'affiliation',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * GET /api/affiliations-mutuelle/{id}
     */
    public function show($id)
    {
        try {
            $affiliation = AffiliationMutuelle::with([
                'employe:id,matricule,nom,prenom,departement_id',
                'mutuelle:id,nom',
                'regime:id,libelle,taux_couverture,cotisation_mensuelle,part_employeur_pct,part_employe_pct'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $affiliation
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Affiliation non trouvée',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * PUT /api/affiliations-mutuelle/{id}/resilier
     * Résiliation d'une affiliation
     */
    public function resilier(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'date_resiliation' => 'required|date',
                'commentaire' => 'nullable|string|max:500'
            ]);

            $affiliation = AffiliationMutuelle::findOrFail($id);

            // Vérifier que l'affiliation est active
            if ($affiliation->statut !== 'ACTIVE') {
                throw new \Exception('Cette affiliation n\'est pas active');
            }

            // Vérifier que la date de résiliation >= date d'adhésion
            $dateResiliation = \Carbon\Carbon::parse($validated['date_resiliation'])->startOfDay();
            $dateAdhesion = $affiliation->date_adhesion->startOfDay();

            if ($dateResiliation->lt($dateAdhesion)) {
                throw new \Exception('La date de résiliation (' . $dateResiliation->format('d/m/Y') . ') ne peut pas être antérieure à la date d\'adhésion (' . $dateAdhesion->format('d/m/Y') . ')');
            }

            // Mettre à jour l'affiliation
            $affiliation->update([
                'statut' => 'RESILIE',
                'date_resiliation' => $validated['date_resiliation'],
                'commentaire' => $validated['commentaire'] ?? $affiliation->commentaire
            ]);

            // Charger les relations pour la réponse
            $affiliation->load(['employe', 'mutuelle', 'regime']);

            return response()->json([
                'success' => true,
                'data' => $affiliation,
                'message' => 'Affiliation résiliée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * PUT /api/affiliations-mutuelle/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $affiliation = AffiliationMutuelle::findOrFail($id);

            // Validation des données (similaire au store, mais sans l'employé obligatoirement)
            $validated = $request->validate([
                'mutuelle_id' => 'sometimes|exists:mutuelles,id',
                'regime_mutuelle_id' => 'sometimes|exists:regimes_mutuelle,id',
                'numero_adherent' => 'nullable|string|max:50',
                'date_adhesion' => 'sometimes|date',
                'date_resiliation' => 'nullable|date',
                'statut' => 'sometimes|string|in:ACTIVE,RESILIE',
                'ayant_droit' => 'boolean',
                'conjoint_ayant_droit' => 'boolean',
                'commentaire' => 'nullable|string|max:500'
            ]);
            
            DB::beginTransaction();

            // Si on change de régime, vérifier qu'il appartient bien à la mutuelle (si mutuelle aussi changée ou existante)
            if (isset($validated['regime_mutuelle_id'])) {
                $mutuelleId = $validated['mutuelle_id'] ?? $affiliation->mutuelle_id;
                
                $regime = RegimeMutuelle::where('id', $validated['regime_mutuelle_id'])
                    ->where('mutuelle_id', $mutuelleId)
                    ->where('active', true)
                    ->first();

                if (!$regime) {
                    throw new \Exception('Le régime sélectionné n\'appartient pas à cette mutuelle ou n\'est pas actif');
                }
            }

            $affiliation->update($validated);
            
            // Recharger les relations complètes pour le retour
            $affiliation->load([
                'employe:id,matricule,nom,prenom,departement_id,nb_enfants,situation_fm',
                'mutuelle:id,nom', 
                'regime:id,libelle,taux_couverture,cotisation_mensuelle,part_employeur_pct,part_employe_pct'
            ]);
            
            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $affiliation,
                'message' => 'Affiliation mise à jour avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/affiliations-mutuelle/{id}
     */
    public function destroy($id)
    {
        try {
            $affiliation = AffiliationMutuelle::findOrFail($id);

            // On ne peut supprimer que les affiliations résiliées
            if ($affiliation->statut === 'ACTIVE') {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer une affiliation active. Veuillez d\'abord la résilier.'
                ], 400);
            }

            $affiliation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Affiliation supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/employes/affilies-mutuelle
     * Employés ayant au moins une affiliation active
     */
    public function employesAffilies()
    {
        try {
            $employes = Employe::whereHas('affiliationsMutuelle', function($q) {
                    $q->where('statut', 'ACTIVE');
                })
                ->select('id', 'matricule', 'nom', 'prenom')
                ->orderBy('nom')
                ->get();

            return response()->json($employes);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur serveur'], 500);
        }
    }
}
