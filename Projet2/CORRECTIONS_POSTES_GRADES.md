# CORRECTIONS APPLIQUÉES - Postes & Grades

## Problème initial
- Table affichait seulement 2/6 postes
- "Impossible de charger les postes" (connexion refusée)
- Département non aligné avec module CNSS Affiliation
- Colonne Département redondante avec panel gauche
- Table chargeait au montage (avant sélection département)

## Solution implémentée

### 1. Backend (Laravel)
✅ **Migration**: Ajout `departement_id` à table `gp_unites`
```bash
php artisan make:migration add_departement_id_to_gp_unites_table
php artisan migrate --path=database/migrations/2026_02_22_223719_add_departement_id_to_gp_unites_table.php
```

✅ **Model Unite**: Ajout relation `departement()`
```php
public function departement()
{
    return $this->belongsTo(Departement::class, 'departement_id');
}
```

✅ **PosteController**: 
- Ajout `with(['unite'])` pour inclure unite.departement_id
- Support `?departement_id=X` (filtre via gp_unites.departement_id)
- Maintien `?unite_id=X` (filtre direct)

### 2. Database
✅ **Assignation départements aux unités**:
```
Unité Développement (1) → INFO (dept_id: 1)
Unité Data (2) → INFO (dept_id: 1)  
Unité Gestion du Personnel (3) → RH (dept_id: 11)
Unité Comptabilité (4) → IT (dept_id: 10)
```

### 3. Frontend (React)
✅ **fetchDepartmentHierarchy**: Utilise `/api/departements/hierarchy` (même que CNSS)

✅ **fetchPostes**: 
- Ne charge PAS au montage (`if (!selectedDeptId) return`)
- Envoie `departement_id` (au lieu de `unite_id`)
- Charge TOUS les postes si `includeSubDepartments` (filtrage client)


### 4. Gestion des Employés & Compétences (Backend)

✅ **Migration**:
- Ajout `poste_id` dans table `employes`.
- Création table pivot `gp_employe_competence` (`niveau_acquis`, `date_acquisition`).

✅ **Contrôleurs**:
- `PosteController::assignEmploye(Request $request, $id)`: Permet d'assigner un employé à un poste.
- `EmployeController::updateCompetences(Request $request, $id)`: Permet de mettre à jour les compétences acquises.
- Routes API ajoutées correspondantes.

✅ **Modèles**:
- `Employe`: Relations `poste()` et `competences()`.
- `Poste`: Relation `employes()`.


✅ **Colonnes**: Supprimé colonne "Département" (redondant avec panel gauche)

✅ **getSubDepartmentIds**: Fonction récursive pour calculer IDs enfants (pattern CNSS)

## Tests effectués
```bash
# Base de données
php debug_postes.php → 6 postes avec unite_id correct
php debug_depts.php → 4 départements (INFO, Test, IT, RH)

# API
php test_api_postes.php → 4 postes pour dept_id=1 (INFO)
GET /api/postes → 6 postes total
GET /api/postes?departement_id=1 → 4 postes (Développement + Data)
```

## État final
- ✅ Table vide au chargement initial
- ✅ Sélection département INFO → affiche 4 postes
- ✅ "Inclure sous-départements" → charge tous postes + filtre client
- ✅ Colonne Département supprimée
- ✅ Pattern identique à CNSS Affiliation

## Fichiers modifiés
**Backend**:
- `database/migrations/2026_02_22_223719_add_departement_id_to_gp_unites_table.php`
- `app/Models/Unite.php` (+fillable, +relation)
- `app/Http/Controllers/PosteController.php` (+with unite, +departement_id filter)

**Frontend**:
- `ProjetFront/src/Zakaria/CarriereFormation/PositionsGrades.jsx`:
  - fetchDepartmentHierarchy: apiClient.get('/departements/hierarchy')
  - fetchPostes: check selectedDeptId, param departement_id
  - mapPosteToRow: +departement_id field
  - getSubDepartmentIds: fonction récursive
  - allColumns: supprimé {key: "departement"}
  - columnVisibility: supprimé "departement"
