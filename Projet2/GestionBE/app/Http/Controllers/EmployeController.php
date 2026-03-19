<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\EmployeeHistory;
use App\Models\EmployeDepartement;
use App\Models\Departement;
use App\Models\GpCompetence;
use App\Models\Poste;
use App\Models\GpEmployePosteHistorique;
use App\Http\Requests\UpdateEmployeCompetencesRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use App\Imports\EmployesImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\ManagerHierarchyValidator;
use App\Services\ManagerAutoAssignService;



class EmployeController extends Controller
{

    public function index(Request $request)
    {
        // Route publique - pas de vérification de permissions pour la lecture
        $query = Employe::with('departements', 'contrat', 'poste', 'manager:id,nom,prenom,matricule');
        if ($request->filled('departement_id')) {
            $departementId = $request->input('departement_id');
            $query->where(function ($q) use ($departementId) {
                $q->where('departement_id', $departementId)
                  ->orWhereHas('departements', function ($sub) use ($departementId) {
                      $sub->where('departements.id', $departementId);
                  });
            });
        }
        $employes = $query->get();
        return response()->json($employes);
    }





    /**
     * Lightweight employee list for select/dropdown components.
     * Returns only the fields needed by the frontend forms.
     */
    public function listForSelect(Request $request)
    {
        $query = Employe::select(
            'id', 'matricule', 'nom', 'prenom',
            'departement_id', 'fonction', 'poste_id', 'date_embauche', 'manager_id', 'active'
        )->with([
            'departements:id,nom',
            'poste:id,nom,grade_id',
            'manager:id,nom,prenom,matricule,poste_id',
            'manager.poste:id,nom',
        ]);

        // Handle multiple department IDs (for sub-departments filtering)
        if ($request->filled('departement_ids')) {
            $departementIds = $request->input('departement_ids');
            // Ensure it's an array
            if (!is_array($departementIds)) {
                $departementIds = array_filter(explode(',', $departementIds));
            }
            
            $query->where(function ($q) use ($departementIds) {
                $q->whereIn('departement_id', $departementIds)
                  ->orWhereHas('departements', function ($sub) use ($departementIds) {
                      $sub->whereIn('departements.id', $departementIds);
                  });
            });
        }
        // Fallback to single department ID
        elseif ($request->filled('departement_id')) {
            $departementId = $request->input('departement_id');
            $query->where(function ($q) use ($departementId) {
                $q->where('departement_id', $departementId)
                  ->orWhereHas('departements', function ($sub) use ($departementId) {
                      $sub->where('departements.id', $departementId);
                  });
            });
        }

        return response()->json($query->get());
    }

    public function getDashboardStats()
    {
        try {
            $totalEmployees = Employe::where('active', 1)->count();
            $femmes = Employe::where('active', 1)->where('sexe', 'female')->count();
            $hommes = Employe::where('active', 1)->where('sexe', 'male')->count();
            
            return response()->json([
                'totalEmployees' => $totalEmployees,
                'femmes' => $femmes,
                'hommes' => $hommes
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des statistiques du dashboard : ' . $e->getMessage());
            return response()->json([
                'error' => 'Une erreur s\'est produite lors de la récupération des statistiques'
            ], 500);
        }
    }






    
    // public function store(Request $request)
    // { 
    //     // Log des données brutes reçues
    //     Log::info('Requête reçue pour création d\'employé : ', $request->all());
    
    //     $validatedData = $request->validate([
    //         'matricule' => 'nullable|string|max:255',
    //         'num_badge' => 'nullable|string|max:255',
    //         'nom' => 'required|string|max:255',
    //         'prenom' => 'required|string|max:255',
    //         'lieu_naiss' => 'nullable|string|max:255',
    //         'date_naiss' => 'nullable|date',
    //         'cin' => 'nullable|string|max:255',
    //         'cnss' => 'nullable|string|max:255',
    //         'sexe' => 'nullable|string|max:50',
    //         'situation_fm' => 'nullable|string|max:255',
    //         'nb_enfants' => 'nullable|integer',
    //         'adresse' => 'nullable|string|max:255',
    //         'ville' => 'nullable|string|max:255',
    //         'pays' => 'nullable|string|max:255',
    //         'code_postal' => 'nullable|string|max:20',
    //         'tel' => 'nullable|string|max:20',
    //         'fax' => 'nullable|string|max:20',
    //         'email' => 'nullable|string|email|max:35',
    //         'fonction' => 'nullable|string|max:255',
    //         'nationalite' => 'nullable|string|max:255',
    //         'niveau' => 'nullable|string|max:255',
    //         'echelon' => 'nullable|string|max:255',
    //         'categorie' => 'nullable|string|max:255',
    //         'coeficients' => 'nullable|string|max:255',
    //         'imputation' => 'nullable|string|max:255',
    //         'date_entree' => 'nullable|date',
    //         'date_embauche' => 'nullable|date',
    //         'date_sortie' => 'nullable|date',
    //         'salaire_base' => 'nullable|numeric',
    //         'remarque' => 'nullable|string',
    //         'url_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'centreCout' => 'nullable|string|max:255',
    //         'departement_id' => 'nullable|exists:departements,id',
    //         'delivree_par' => 'nullable|string|max:255',
    //         'date_expiration' => 'nullable|date',
    //         'carte_sejour' => 'nullable|string|max:255',
    //         'motif_depart' => 'nullable|string|max:255',
    //         'dernier_jour_travaille' => 'nullable|date',
    //         'notification_rupture' => 'nullable|date',
    //         'engagement_procedure' => 'nullable|date',
    //         'signature_rupture_conventionnelle' => 'nullable|date',
    //         'transaction_en_cours' => 'nullable|boolean',
    //         'bulletin_modele' => 'nullable|string',
    //         'salaire_moyen' => 'nullable|numeric',
    //         'salaire_reference_annuel' => 'nullable|numeric',
    //         'poste_id' => 'required|exists:gp_postes,id',
    //     ]);
    
    //     Log::info('Données validées pour création d\'employé : ', $validatedData);
    
    //     try {
    //         DB::beginTransaction();
    
    //         $employeData = $validatedData;
    //         $employeData['active'] = 1;
    
    //         if ($request->hasFile('url_img')) {
    //             $imagePath = $request->file('url_img')->store('employee_images', 'public');
    //             $employeData['url_img'] = $imagePath;
    
    //             Log::info('Image enregistrée à : ' . $imagePath);
    //         }
    
    //         $employe = Employe::create($employeData);
    
    //         Log::info('Employé enregistré en base de données : ', $employe->toArray());
    
    //         if ($request->departement_id) {
    //             $employeDepartementController = new EmployeDepartementController();
    //             $employeDepartementController->store(new Request([
    //                 'employe_id' => $employe->id,
    //                 'departement_id' => $request->departement_id,
    //                 'date_début' => $employeData['date_entree'] ?? now()->toDateString()
    //             ]));
    
    //             Log::info("Département associé à l'employé : " . $request->departement_id);
    //         }
    
    //         DB::commit();
    
    //         return response()->json($employe->load('departements.parent'), 201);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    


    //         Log::error('Erreur lors de la création de l\'employé : ' . $e->getMessage(), [
    //             'stack' => $e->getTraceAsString()
    //         ]);
    
    //         return response()->json([
    //             'error' => 'Une erreur s\'est produite lors de la création de l\'employé : ' . $e->getMessage()
    //         ], 500);
    //     }
    // }
    



    public function store(Request $request)
    { 
        Log::info('Requête reçue pour création d\'employé : ', $request->all());
    
        $validatedData = $request->validate([
            'matricule' => 'nullable|string|max:255',
            'num_badge' => 'nullable|string|max:255',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'lieu_naiss' => 'nullable|string|max:255',
            'date_naiss' => 'nullable|date',
            'cin' => 'nullable|string|max:255',
            'cnss' => 'nullable|string|max:255',
            'sexe' => 'nullable|string|max:50',
            'situation_fm' => 'nullable|string|max:255',
            'nb_enfants' => 'nullable|integer',
            'adresse.ville' => 'nullable|string|max:255',
             'adresse.pays' => 'nullable|string|max:255',
'adresse.codePostal' => 'nullable|string|max:20',
'adresse.commune' => 'nullable|string|max:255',
'adresse.codePays' => 'nullable|string|max:10',
            'tel' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:35',
            'fonction' => 'nullable|string|max:255',
            'nationalite' => 'nullable|string|max:255',
            'niveau' => 'nullable|string|max:255',
            'echelon' => 'nullable|string|max:255',
            'categorie' => 'nullable|string|max:255',
            'coeficients' => 'nullable|string|max:255',
            'imputation' => 'nullable|string|max:255',
            'date_entree' => 'nullable|date',
            'date_embauche' => 'nullable|date',
            'date_sortie' => 'nullable|date',
            'salaire_base' => 'nullable|numeric',
            'remarque' => 'nullable|string',
            'url_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'centreCout' => 'nullable|string|max:255',
            'departement_id' => 'nullable|exists:departements,id',
            'delivree_par' => 'nullable|string|max:255',
            'date_expiration' => 'nullable|date',
            'carte_sejour' => 'nullable|string|max:255',
            'motif_depart' => 'nullable|string|max:255',
            'dernier_jour_travaille' => 'nullable|date',
            'notification_rupture' => 'nullable|date',
            'engagement_procedure' => 'nullable|date',
            'signature_rupture_conventionnelle' => 'nullable|date',
            'transaction_en_cours' => 'nullable|boolean',
            'bulletin_modele' => 'nullable|string',
            'salaire_moyen' => 'nullable|numeric',
            'salaire_reference_annuel' => 'nullable|numeric',
            'poste_id' => 'nullable|exists:gp_postes,id',
            'manager_id' => 'nullable|exists:employes,id',
        ]);
    
        Log::info('Données validées pour création d\'employé : ', $validatedData);

        if (!empty($validatedData['manager_id'])) {
            $managerError = app(ManagerHierarchyValidator::class)->validate(null, (int) $validatedData['manager_id']);
            if ($managerError) {
                return response()->json(['message' => $managerError], 422);
            }
        }
    
        try {
            DB::beginTransaction();
    
            $employeData = $validatedData;
            $employeData['active'] = 1;

            $employeData['ville'] = $request->input('adresse.ville');
            $employeData['pays'] = $request->input('adresse.pays');
            $employeData['code_postal'] = $request->input('adresse.codePostal');
            $employeData['commune'] = $request->input('adresse.commune');
            $employeData['code_pays'] = $request->input('adresse.codePays');



            $employeData['salaire_base'] = $request->input('salaire.salaire_base');
            $employeData['salaire_moyen'] = $request->input('salaire.salaire_moyen');
            $employeData['salaire_reference_annuel'] = $request->input('salaire.salaire_reference_annuel');


            if (isset($employeData['adresse'])) {
                unset($employeData['adresse']);
            }

            
            if ($request->hasFile('url_img')) {
                $imagePath = $request->file('url_img')->store('employee_images', 'public');
                $employeData['url_img'] = $imagePath;
    
                Log::info('Image enregistrée à : ' . $imagePath);
            }
    
            $employe = Employe::create($employeData);

            if (empty($employe->manager_id)) {
                $autoManagerId = app(ManagerAutoAssignService::class)->suggestManagerId($employe);
                if ($autoManagerId) {
                    $employe->manager_id = $autoManagerId;
                    $employe->save();
                }
            }
    
            Log::info('Employé enregistré en base de données : ', $employe->toArray());
    
            if ($request->departement_id) {
                $dateDebut = $employeData['date_entree'] ?? now()->toDateString();

                EmployeDepartement::updateOrCreate(
                    [
                        'employe_id' => $employe->id,
                        'departement_id' => $request->departement_id,
                    ],
                    [
                        'date_début' => $dateDebut,
                        'date_fin' => null,
                    ]
                );

                $departement = Departement::find($request->departement_id);
                EmployeeHistory::create([
                    'matricule' => $employe->matricule,
                    'nom' => $employe->nom,
                    'prenom' => $employe->prenom,
                    'departement_id' => $request->departement_id,
                    'departement_nom' => $departement?->nom,
                    'employe_id' => $employe->id,
                    'date_début' => $dateDebut,
                    'date_fin' => null,
                    'action' => 'nouvelle entrée',
                ]);

                Log::info("Département associé à l'employé : " . $request->departement_id);
            }
    

            if ($employe->poste_id) {
                $hasActiveHistorique = GpEmployePosteHistorique::where('employe_id', $employe->id)
                    ->whereNull('date_fin')
                    ->exists();

                if (!$hasActiveHistorique) {
                    $poste = Poste::find($employe->poste_id);
                    GpEmployePosteHistorique::createWithAutoType([
                        'employe_id' => $employe->id,
                        'poste_id' => $employe->poste_id,
                        'grade_id' => $poste?->grade_id,
                        'date_debut' => now()->toDateString(),
                        'date_fin' => null,
                        'statut' => 'Validé',
                    ]);
                }
            }            DB::commit();
    
            return response()->json($employe->load('departements.parent', 'manager:id,nom,prenom,matricule'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
    


            Log::error('Erreur lors de la création de l\'employé : ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);
    
            return response()->json([
                'error' => 'Une erreur s\'est produite lors de la création de l\'employé : ' . $e->getMessage()
            ], 500);
        }
    }




    
    
    public function show(Employe $employe)
    {
        return response()->json($employe->load('departements','contrat','manager:id,nom,prenom,matricule'));
    }




    public function update(Request $request, Employe $employe)
    {
        // Permission check removed for public access

        $validatedData = $request->validate([
            'matricule' => 'nullable|string|max:255',
            'num_badge' => 'nullable|string|max:255',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'lieu_naiss' => 'nullable|string|max:255',
            'date_naiss' => 'nullable|date',
            'cin' => 'nullable|string|max:255',
            'cnss' => 'nullable|string|max:255',
            'sexe' => 'nullable|string|max:50',
            'situation_fm' => 'nullable|string|max:255',
            'nb_enfants' => 'nullable|integer',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:20',
            'tel' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:35',
            'fonction' => 'nullable|string|max:255',
            'nationalite' => 'nullable|string|max:255',
            'niveau' => 'nullable|string|max:255',
            'echelon' => 'nullable|string|max:255',
            'categorie' => 'nullable|string|max:255',
            'coeficients' => 'nullable|string|max:255',
            'imputation' => 'nullable|string|max:255',
            'date_entree' => 'nullable|date',
            'date_embauche' => 'nullable|date',
            'date_sortie' => 'nullable|date',
            'salaire_base' => 'nullable|numeric',
            'remarque' => 'nullable|string',
            'url_img' => 'nullable',
            'centreCout' => 'nullable|string|max:255',
            'departement_id' => 'nullable|exists:departements,id', 
            'delivree_par' => 'nullable|string|max:255',
            'date_expiration' => 'nullable|date',
            'carte_sejour' => 'nullable|string|max:255',
            'motif_depart' => 'nullable|string|max:255',
            'dernier_jour_travaille' => 'nullable|date',
            'notification_rupture' => 'nullable|date',
            'engagement_procedure' => 'nullable|date',
            'signature_rupture_conventionnelle' => 'nullable|date',
            'transaction_en_cours' => 'nullable|boolean',
            'bulletin_modele' => 'nullable|string',
            'salaire_moyen' => 'nullable|numeric',
            'salaire_reference_annuel' => 'nullable|numeric',
            'poste_id' => 'nullable|exists:gp_postes,id',
            'manager_id' => 'nullable|exists:employes,id',

        ]);

        if (array_key_exists('manager_id', $validatedData)) {
            $managerError = app(ManagerHierarchyValidator::class)->validate(
                (int) $employe->id,
                $validatedData['manager_id'] ? (int) $validatedData['manager_id'] : null
            );

            if ($managerError) {
                return response()->json(['message' => $managerError], 422);
            }
        } else {
            $autoManagerId = app(ManagerAutoAssignService::class)->suggestManagerId($employe);
            if ($autoManagerId) {
                $validatedData['manager_id'] = $autoManagerId;
            }
        }
    
        try {
            DB::beginTransaction();
            $employeData = $validatedData;
            $employeData['active'] = 1; 
    
            if ($request->hasFile('url_img')) {
                $imagePath = $request->file('url_img')->store('employee_images', 'public');
                $employeData['url_img'] = $imagePath;
            }
    
            $employe->update($employeData);

            // Track poste changes in career history
            if ($employe->wasChanged('poste_id') && $employe->poste_id) {
                // Close previous active historique
                GpEmployePosteHistorique::where('employe_id', $employe->id)
                    ->whereNull('date_fin')
                    ->update(['date_fin' => now()->toDateString()]);

                // Create new historique entry with automatic type_evolution
                $poste = Poste::find($employe->poste_id);
                GpEmployePosteHistorique::createWithAutoType([
                    'employe_id' => $employe->id,
                    'poste_id' => $employe->poste_id,
                    'grade_id' => $poste?->grade_id,
                    'date_debut' => now()->toDateString(),
                    'date_fin' => null,
                    'statut' => 'Validé',
                ]);
            } elseif ($employe->poste_id) {
                // Ensure at least one active historique exists
                $hasActiveHistorique = GpEmployePosteHistorique::where('employe_id', $employe->id)
                    ->whereNull('date_fin')
                    ->exists();

                if (!$hasActiveHistorique) {
                    $poste = Poste::find($employe->poste_id);
                    GpEmployePosteHistorique::createWithAutoType([
                        'employe_id' => $employe->id,
                        'poste_id' => $employe->poste_id,
                        'grade_id' => $poste?->grade_id,
                        'date_debut' => now()->toDateString(),
                        'date_fin' => null,
                        'statut' => 'Validé',
                    ]);
                }
            }
            
            if ($request->departement_id) {
                $departement = Departement::find($request->departement_id);
                
                // Update the active history record instead of creating a new one
                $currentHistory = EmployeeHistory::where('employe_id', $employe->id)
                    ->whereNull('date_fin')
                    ->first();
    
                if ($currentHistory) {
                    $currentHistory->update([
                        'matricule' => $employe->matricule,
                        'nom' => $employe->nom,
                        'prenom' => $employe->prenom,
                        'departement_id' => $request->departement_id,
                        'departement_nom' => $departement->nom ?? '',
                        'date_début' => $employeData['date_entree'] ?? $currentHistory->date_début,
                        'action' => 'update'
                    ]);
                } else {

                    EmployeeHistory::create([
                        'matricule' => $employe->matricule,
                        'nom' => $employe->nom,
                        'prenom' => $employe->prenom,
                        'departement_id' => $request->departement_id,
                        'departement_nom' => $departement->nom ?? '',
                        'employe_id' => $employe->id,
                        'date_début' => $employeData['date_entree'] ?? now()->toDateString(),
                        'date_fin' => null,
                        'action' => 'update'
                    ]);
                }
    
                // Mettre à jour la relation avec le département
                $employe->departements()->sync([$request->departement_id => [
                    'date_début' => $employeData['date_entree'] ?? now()->toDateString()
                ]]);
            }

            DB::commit();
            return response()->json($employe->load('departements.parent', 'poste', 'manager:id,nom,prenom,matricule'), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating employee', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Une erreur est survenue lors de la mise à jour de l\'employé: ' . $e->getMessage()], 500);
        }
    }








    public function updateDepartement(Request $request)
    {
        try {
            $employeIds = $request->input('employeIds');
            $date_fin = $request->input('date_fin', now()->toDateString());

            DB::beginTransaction();

            foreach ($employeIds as $employeId) {
                $employe = Employe::find($employeId);
                
                if ($employe) {
                    $oldDepartmentId = $employe->departement_id;
                    $oldDepartment = Departement::find($oldDepartmentId);
                    $lastEmployeDepartement = EmployeDepartement::where('employe_id', $employeId)
                        ->whereNull('date_fin')
                        ->orderBy('date_début', 'desc')
                        ->first();

                    $employe->departement_id = 0;
                    $employe->active = 0;
                    $employe->save();
                    
                    EmployeeHistory::create([
                        'matricule' => $employe->matricule,
                        'nom' => $employe->nom,
                        'prenom' => $employe->prenom,
                        'departement_id' => $oldDepartmentId,
                        'departement_nom' => $oldDepartment ? $oldDepartment->nom : null,
                        'employe_id' => $employe->id,
                        'date_début' => $lastEmployeDepartement ? $lastEmployeDepartement->date_début : $employe->created_at->toDateString(),
                        'date_fin' => $date_fin,
                        'action' => 'removed from department'
                    ]);

                    // Update the employe_departement table
                    DB::table('employe_departement')
                        ->where('employe_id', $employeId)
                        ->whereNull('date_fin')
                        ->update(['date_fin' => $date_fin]);
                }
            }

            DB::commit();

            return response()->json(['message' => 'Employees updated successfully and history recorded'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating employee departments: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while updating employees'], 500);
        }
    }


    public function destroy($employe)
    {
        try {
            $employeModel = Employe::find($employe);

            if (!$employeModel) {
                return response()->json(['message' => 'Employé déjà supprimé'], 200);
            }

            $employeModel->delete();
            return response()->json(['message' => 'Employé supprimé avec succès'], 200);
        } catch (\Exception $e) {
            Log::error('Erreur suppression employé', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Une erreur est survenue lors de la suppression de l\'employé'], 500);
        }
    }



    
    public function import(Request $request)
    {
        \Log::info('Début de l\'importation de fichier.');
        \Log::info('l\'importation de fichier : ', $request->all());
    
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
            'fieldMappings' => 'required',
            'departement_id' => 'required|integer',
        ]);
    
        $departementId = $request->input('departement_id');
    
        \Log::info('Validation des données réussie.');
    
        try {
            $fieldMappings = json_decode($request->input('fieldMappings'), true);
    
            if (json_last_error() !== JSON_ERROR_NONE) {
                \Log::error('Erreur de décodage JSON : ' . json_last_error_msg());
                return response()->json(['error' => 'Champ fieldMappings invalide'], 400);
            }
    
            // Nettoyer les lettres de colonnes (ex : "B2" => "B")
            $fieldMappings = array_map(function ($col) {
                return preg_replace('/\d+/', '', strtoupper($col));
            }, $fieldMappings);
    
            \Log::info('fieldMappings décodé avec succès :', $fieldMappings);
    
            // Passer aussi departementId au constructeur
            Excel::import(new EmployesImport($fieldMappings, $departementId), $request->file('file'));
    
            \Log::info('Importation Excel terminée avec succès.');
    
            return response()->json(['message' => 'Import terminé avec succès']);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'importation : ' . $e->getMessage());
            return response()->json(['error' => 'Échec de l\'importation'], 500);
        }
    }
    


    public function getThemesBulletins(Request $request)
    {
        $ids = $request->query('ids');
        if (!$ids) {
            return response()->json([], 200);
        }
    
        $idsArray = explode(',', $ids);
    
        $employes = Employe::with('bulletins.modele.theme')
                    ->whereIn('id', $idsArray)
                    ->get();
    
        $result = $employes->map(function ($employe) {
            return [
                'employe_id' => $employe->id,
                'theme_bulletin' => $employe->bulletins->first()?->modele?->theme?->designation ?? null,
            ];
        });
    
        return response()->json($result);
    }
    
    
    public function getRubriquesEtConstantes($id)
    {
        $employe = Employe::with(['bulletins.modele.rubriques', 'bulletins.modele.constantes'])->findOrFail($id);
    
        $rubriques = collect();
        $constantes = collect();
    
        foreach ($employe->bulletins as $bulletin) {
            if ($bulletin->modele) {
                $rubriques = $rubriques->merge($bulletin->modele->rubriques);
                $constantes = $constantes->merge($bulletin->modele->constantes);
            }
        }
    
        return response()->json([
            'rubriques' => $rubriques->unique('id')->values(),
            'constantes' => $constantes->unique('id')->values(),
        ]);
    }

    public function getCompetences($id)
    {
        // Vérifier que l'employé existe (requête légère)
        if (!Employe::where('id', $id)->exists()) {
            return response()->json(['error' => 'Employé non trouvé'], 404);
        }

        // Requête optimisée directe sans charger tout le modèle Employe
        $competences = DB::table('gp_employe_competence')
            ->join('gp_competences', 'gp_competences.id', '=', 'gp_employe_competence.competence_id')
            ->where('gp_employe_competence.employe_id', $id)
            ->select(
                'gp_competences.id',
                'gp_competences.nom',
                'gp_competences.categorie',
                'gp_competences.description',
                'gp_employe_competence.niveau',
                'gp_employe_competence.niveau_acquis',
                'gp_employe_competence.date_acquisition'
            )
            ->get()
            ->map(function ($comp) {
                return [
                    'id' => $comp->id,
                    'nom' => $comp->nom,
                    'categorie' => $comp->categorie,
                    'description' => $comp->description,
                    'niveau' => $comp->niveau ?? $comp->niveau_acquis ?? 0,
                    'pivot' => [
                        'niveau' => $comp->niveau,
                        'niveau_acquis' => $comp->niveau_acquis,
                        'date_acquisition' => $comp->date_acquisition,
                    ],
                ];
            });

        return response()->json($competences);
    }

    public function updateCompetences(UpdateEmployeCompetencesRequest $request, $id)
    {
        $employe = Employe::findOrFail($id);
        
        $competenceIds = $request->input('competence_ids', []);
        $pivots = $request->input('pivots', []);

        $formattedSync = [];
        foreach ($competenceIds as $competenceId) {
            $pivotData = [];
            if (isset($pivots[$competenceId])) {
                // Ensure array_intersect_key only keeps known fields if desired,
                // or just pass the associative array if structure is trusted.
                // safer:
                $pivotData = [
                    'niveau' => $pivots[$competenceId]['niveau'] ?? $pivots[$competenceId]['niveau_acquis'] ?? null,
                    'niveau_acquis' => $pivots[$competenceId]['niveau_acquis'] ?? $pivots[$competenceId]['niveau'] ?? null,
                    'date_acquisition' => $pivots[$competenceId]['date_acquisition'] ?? null,
                ];
            }
            $formattedSync[$competenceId] = $pivotData;
        }

        $employe->competences()->sync($formattedSync);

        return response()->json([
            'message' => 'Compétences mises à jour avec succès',
            'competences' => $employe->load('competences')->competences
        ]);
    }

    public function addCompetence(Request $request, $id)
    {
        $data = $request->validate([
            'competence_id' => 'required|exists:gp_competences,id',
            'niveau' => 'required|integer|min:0|max:5',
        ]);

        $employe = Employe::findOrFail($id);

        $exists = $employe->competences()->where('competence_id', $data['competence_id'])->exists();
        $pivotData = [
            'niveau' => $data['niveau'],
            'niveau_acquis' => $data['niveau'],
        ];

        if ($exists) {
            $employe->competences()->updateExistingPivot($data['competence_id'], $pivotData);
        } else {
            $employe->competences()->attach($data['competence_id'], $pivotData);
        }

        return response()->json([
            'message' => 'Compétence ajoutée avec succès',
            'competence_id' => $data['competence_id'],
            'niveau' => $data['niveau'],
        ], 201);
    }

    public function updateCompetence(Request $request, $id, $competenceId)
    {
        $data = $request->validate([
            'niveau' => 'required|integer|min:0|max:5',
        ]);

        $employe = Employe::findOrFail($id);
        $employe->competences()->syncWithoutDetaching([
            $competenceId => [
                'niveau' => $data['niveau'],
                'niveau_acquis' => $data['niveau'],
            ]
        ]);

        return response()->json([
            'message' => 'Compétence mise à jour avec succès',
            'competence_id' => $competenceId,
            'niveau' => $data['niveau'],
        ]);
    }

    public function deleteCompetence($id, $competenceId)
    {
        $employe = Employe::findOrFail($id);
        $employe->competences()->detach($competenceId);

        return response()->json([
            'message' => 'Compétence supprimée avec succès',
            'competence_id' => $competenceId,
        ]);
    }
}



