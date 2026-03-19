# UI Compétences - Modal de Gestion

## ✅ Modifications appliquées

### Problème initial
Le champ "Compétences requises" utilisait un simple `<select multiple>` avec scrollbar (interface peu ergonomique).

### Solution implémentée
Pattern **identique** à la modal "Gérer les Types d'opération" (AddCnssOperation.jsx).

---

## 1. Frontend - AddPoste.jsx

### Imports ajoutés
```jsx
import ManageResourceModal from "../cnss/ManageResourceModal";
```

### State ajouté
```jsx
const [manageCompetencesModal, setManageCompetencesModal] = useState(false);
const [competencesResources, setCompetencesResources] = useState([]);
```

### Handlers CRUD
```jsx
handleAddCompetence(name)    → POST /api/competences
handleEditCompetence(id, name) → PUT /api/competences/{id}
handleDeleteCompetence(id)   → DELETE /api/competences/{id}
```

### UI modifiée
**Avant** :
```jsx
<Form.Select multiple>
  {competences.map(...)}
</Form.Select>
```

**Après** :
```jsx
<div style={{ display: "flex", gap: "8px" }}>
  <Form.Select multiple style={{ flex: 1 }}>
    {competences.map(...)}
  </Form.Select>
  <button onClick={() => setManageCompetencesModal(true)}>
    +
  </button>
</div>
```

### Modal ajoutée
```jsx
<ManageResourceModal
  show={manageCompetencesModal}
  onHide={() => setManageCompetencesModal(false)}
  title="Gérer les compétences"
  items={competencesResources}
  onAdd={handleAddCompetence}
  onEdit={handleEditCompetence}
  onDelete={handleDeleteCompetence}
  placeholder="Nouveau..."
/>
```

---

## 2. Backend - CompetenceController.php

### Routes déjà existantes (api.php)
```php
Route::apiResource('competences', CompetenceController::class);
```

Génère automatiquement:
- `GET /api/competences` → index()
- `POST /api/competences` → store()
- `PUT /api/competences/{id}` → update()
- `DELETE /api/competences/{id}` → destroy()

### Validation
**StoreCompetenceRequest.php**:
```php
'nom' => 'required|string|max:255',
'categorie' => 'nullable|string|max:255',
'description' => 'nullable|string',
```

**UpdateCompetenceRequest.php**:
```php
'nom' => 'sometimes|required|string|max:255',
'categorie' => 'nullable|string|max:255',
'description' => 'nullable|string',
```

---

## 3. Comportement

### Flux utilisateur
1. **Ouvrir formulaire Poste** → champ "Compétences requises" avec bouton "+"
2. **Cliquer "+"** → modal "Gérer les compétences" s'ouvre
3. **Ajouter compétence**:
   - Saisir nom dans input "Nouveau..."
   - Cliquer "+" → POST `/api/competences`
   - Refresh liste parent → nouvelle compétence disponible dans le select
4. **Modifier compétence**:
   - Cliquer icône edit (crayon)
   - Mode édition inline
   - Cliquer icône save → PUT `/api/competences/{id}`
5. **Supprimer compétence**:
   - Cliquer icône delete (poubelle)
   - Confirmation → DELETE `/api/competences/{id}`
   - Si compétence sélectionnée → retirée de `competence_ids`
6. **Fermer modal** → bouton "Fermer" en bas

### Synchronisation
- Après chaque opération (Add/Edit/Delete):
  - `onPosteAdded()` est appelé pour refresh la liste parent
  - `competencesResources` est mis à jour via `useEffect` sur `competences` prop
  - La modal reste ouverte (sauf pour "Fermer")

### Gestion des sélections
- Si une compétence sélectionnée est supprimée:
  - Elle est automatiquement retirée de `formState.competence_ids`
- Les nouvelles compétences ajoutées apparaissent immédiatement dans le select

---

## 4. Composants réutilisés

### ManageResourceModal.jsx
Composant générique déjà utilisé pour:
- "Gérer les Types d'opération" (CNSS)
- "Gérer les Types de document" (CNSS)
- **Maintenant: "Gérer les compétences" (Postes & Grades)**

**Props**:
```jsx
{
  show: boolean,
  onHide: () => void,
  title: string,
  items: Array<{ id, name }>,
  onAdd: (name: string) => Promise<any>,
  onEdit: (id, name: string) => Promise<void>,
  onDelete: (id) => Promise<void>,
  placeholder: string
}
```

**Style**: Identique à l'image de référence
- Header avec titre + bouton X
- Input "Nouveau..." + bouton "+" (teal #2c767c)
- Table avec colonnes: Nom | Actions
- Actions: Edit (crayon), Delete (poubelle)
- Footer avec bouton "Fermer"

---

## 5. Tests de validation

### Frontend
```bash
cd ProjetFront
npm run dev
```
1. Ouvrir module "Postes & Grades"
2. Cliquer "Ajouter un poste"
3. Vérifier présence du bouton "+" à côté du select compétences
4. Cliquer "+" → modal s'ouvre
5. Tester Add/Edit/Delete

### Backend
```bash
# Test API manuelle
POST http://127.0.0.1:8000/api/competences
Body: { "nom": "React" }

PUT http://127.0.0.1:8000/api/competences/1
Body: { "nom": "React Advanced" }

DELETE http://127.0.0.1:8000/api/competences/1
```

---

## Fichiers modifiés

**Frontend**:
- `ProjetFront/src/Zakaria/CarriereFormation/AddPoste.jsx`
  - +import ManageResourceModal
  - +state manageCompetencesModal, competencesResources
  - +handlers handleAddCompetence, handleEditCompetence, handleDeleteCompetence
  - Modif UI: select + bouton "+"
  - +ManageResourceModal JSX

**Backend**: 
- Aucune modification (API déjà fonctionnelle)
  - CompetenceController.php ✅
  - StoreCompetenceRequest.php ✅
  - UpdateCompetenceRequest.php ✅
  - routes/api.php → apiResource('competences') ✅

---

## ✨ Résultat final

✅ **Champ compétences** : Select + bouton "+" (au lieu de listbox scroll)
✅ **Modal CRUD** : Identique à "Types d'opération" (AddCnssOperation)
✅ **Backend** : Utilise `/api/competences` existant
✅ **Réutilisabilité** : ManageResourceModal partagé (CNSS + Postes&Grades)
✅ **Synchronisation** : Refresh automatique après chaque opération
✅ **UX cohérente** : Même style/comportement que le reste de l'app
