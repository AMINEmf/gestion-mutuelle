# Quick Reference - Panel de Suggestions des Postes

## 📋 Résumé Rapide (30 sec)

**Quoi?** Panel qui affiche analyse IA de compatibilité entre employé et poste  
**Où?** Page "Postes & Grades" → Suggestions → Clic "Voir analyse"  
**Fichiers clés:**
- [PosteSuggestionsDrawer.jsx](#1-postesuggestionsdrawer) - Le drawer (affichage)
- [PositionsGrades.jsx](#2-positionsgrades) - Le parent (état + API)
- [Style.css](#4-stylecss) - Styles (.cnss-*)

**État:** En production, fonctionne correctement  
**Dernière modification:** Panel de détails employé intégré

---

## 📁 RÉPERTOIRE COMPLET DES FICHIERS

### 1. PosteSuggestionsDrawer.jsx
**Chemin:** `ProjetFront/src/Zakaria/CarriereFormation/PosteSuggestionsDrawer.jsx`  
**Type:** React Component (Stateless)  
**Taille:** ~371 lignes  
**Dépendances:** `react`, `lucide-react`

**Responsabilités:**
- Affiche l'analyse d'un employé pour un poste
- Render des scores, compétences, historique
- Appel du callback `onClose()` au fermeture

**Props requises:**
```javascript
{
  employee: Object,      // Données employé avec scores
  poste: Object,         // Données poste
  onClose: Function      // Callback fermeture
}
```

**Sections affichées:**
1. Header avec nom employé
2. Information du poste
3. Compétences requises
4. Score d'adéquation (global + détails)
5. Analyse des compétences
6. Parcours & historique (postes + formations)

**CSS Classes:**
- `.cnss-side-panel` - Conteneur principal
- `.cnss-form-header` - En-tête
- `.cnss-close-btn` - Bouton fermeture
- `.cnss-form-body` - Corps scrollable
- `.cnss-section-title` - Titres sections
- `.cnss-field-group` - Groupes champs
- `.cnss-form-label` - Labels
- `.parcours-historique-scroll` - Scrollbar custom

**Imports:**
```javascript
import React from 'react';
import { X, User, Award, TrendingUp } from 'lucide-react';
```

---

### 2. PositionsGrades.jsx
**Chemin:** `ProjetFront/src/Zakaria/CarriereFormation/PositionsGrades.jsx`  
**Type:** React Component (Container/Smart)  
**Taille:** ~1700+ lignes  
**Dépendances:** `@mui/material`, `react-bootstrap`, `sweetalert2`, `framer-motion`

**Responsabilités:**
- Gère l'état du drawer
- Fetch des suggestions d'IA via API
- Gère l'assignation d'employés
- Gère la sélection/affichage des postes

**États pertinents:**
```javascript
const [showAiDetailsDrawer, setShowAiDetailsDrawer] = useState(false);
const [selectedAiPosteEmployee, setSelectedAiPosteEmployee] = useState(null);
const [selectedPoste, setSelectedPoste] = useState(null);
const [aiSuggestions, setAiSuggestions] = useState([]);
const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);
```

**Fonctions clés:**

#### fetchAiSuggestions(posteId)
- **Ligne:** ~231
- **Appel API:** `GET /postes/{posteId}/suggestions`
- **Effet:** Charge suggestions pour un poste
- **Déclencheur:** useEffect quand `isSuggestionOpen` ou `detailsPosteId` changent

#### handleOpenSuggestionPanel(poste)
- **Ligne:** ~700
- **Effet:** Ouvre le panel de suggestions
- **Action:** Setters divers états

#### handleCloseSuggestionPanel()
- **Ligne:** ~715
- **Effet:** Ferme le panel
- **Action:** Reset tous les états

#### handleAssignEmployee(employeeId, employeeName)
- **Ligne:** ~628
- **Appel API:** `POST /postes/{posteId}/assign-employe`
- **Effet:** Assigne employé à poste
- **Déclencheur:** Clic bouton "Assigner"

**Rendu du drawer:**
```jsx
// Ligne ~ 1587-1591
{showAiDetailsDrawer && selectedAiPosteEmployee && selectedPoste && (
  <PosteSuggestionsDrawer
    employee={selectedAiPosteEmployee}
    poste={selectedPoste}
    onClose={() => {
      setShowAiDetailsDrawer(false);
      setSelectedAiPosteEmployee(null);
    }}
  />
)}
```

**Autres API calls:**
- `fetchPostes()` - GET /postes
- `fetchCompetences()` - GET /competences
- `fetchGrades()` - GET /grades
- `fetchDepartmentHierarchy()` - GET /departements/hierarchy

---

### 3. apiClient.js
**Chemin:** `ProjetFront/src/services/apiClient.js`  
**Type:** Service/Utility  
**Responsabilité:** Client HTTP centralisé

**Usage:**
```javascript
import apiClient from "../../services/apiClient";
await apiClient.get(url);
await apiClient.post(url, data);
```

---

### 4. Style.css
**Chemin:** `ProjetFront/src/Zakaria/Style.css`  
**Type:** Feuille de styles CSS  
**Contient:** Toutes les classes `.cnss-*`

**Classes définies:**
```css
.cnss-side-panel { ... }
.cnss-form-header { ... }
.cnss-close-btn { ... }
.cnss-form-body { ... }
.cnss-section-title { ... }
.cnss-field-group { ... }
.cnss-form-label { ... }
.cnss-form-control { ... }
```

---

### 5. CareerTraining.css
**Chemin:** `ProjetFront/src/Zakaria/CarriereFormation/CareerTraining.css`  
**Type:** Feuille de styles CSS  
**Contient:** Styles supplémentaires pour carrière

---

### 6. CarrieresTable.jsx
**Chemin:** `ProjetFront/src/Zakaria/CarriereFormation/CarrieresTable.jsx`  
**Type:** React Component  
**Exporte:** `EmployeeProfileDrawer` utilisé par PositionsGrades
**Similaire à:** PosteSuggestionsDrawer (même pattern UI)

---

### 7. AddCarriere.jsx
**Chemin:** `ProjetFront/src/Zakaria/CarriereFormation/AddCarriere.jsx`  
**Type:** React Component  
**Utilise:** Mêmes classes CSS `.cnss-*`  
**Pattern:** Form drawer similaire

---

### 8. Features - Suggestions Formations
**Chemin:** `ProjetFront/src/Zakaria/CarriereFormation/features/formations/`

#### SuggestedParticipantsPanel.jsx
- Drawer similaire pour suggestions de participants à formations
- Utilise mêmes classes CSS

#### useSmartSuggestions.js
- Hook personnalisé pour suggestions intelligentes
- Logique métier réutilisable

#### useSuggestedParticipants.js
- Hook pour gérer participants suggérés

---

## 🔌 ENDPOINTS API

| Endpoint | Méthode | Utilisé par | Description |
|----------|---------|------------|-------------|
| `/postes/{id}/suggestions` | GET | fetchAiSuggestions() | Suggestions IA |
| `/postes/{id}/assign-employe` | POST | handleAssignEmployee() | Assignation employé |
| `/postes` | GET | fetchPostes() | Liste postes |
| `/competences` | GET | fetchCompetences() | Liste compétences |
| `/grades` | GET | fetchGrades() | Liste grades |
| `/departements/hierarchy` | GET | fetchDepartmentHierarchy() | Arborescence depts |

---

## 📊 STRUCTURE DE DONNÉES

### Employee (from API suggestions)
```javascript
{
  id: number,
  full_name: string,
  nom: string,
  prenom: string,
  score: number,
  ai_score_details: {
    globalScore: number,
    competencesScore: number,
    gradeScore: number,
    tenureScore: number
  },
  competence_matches: Array,
  historique_postes: Array,
  formations: Array
}
```

### Poste (from API)
```javascript
{
  id: number,
  poste: string,
  nom: string,
  grade: string,
  departement_id: number,
  raw_competences: Array
}
```

---

## 🔄 FLUX D'EXÉCUTION

```
1. User clicks "Voir suggestions" on Poste
   └─> handleOpenSuggestionPanel(poste)

2. PositionsGrades state updates
   └─> useEffect triggered

3. fetchAiSuggestions(posteId)
   └─> API call: GET /postes/{id}/suggestions

4. Backend calculates scores
   └─> Returns employee suggestions

5. aiSuggestions state updated
   └─> Render suggestions list

6. User clicks "Voir analyse" on employee
   └─> setSelectedAiPosteEmployee(emp)
   └─> setShowAiDetailsDrawer(true)

7. Conditional render activates
   └─> <PosteSuggestionsDrawer {...} />

8. Drawer displays with all data
   └─> Scrollable sections
   └─> Progress bars
   └─> Status badges

9. User clique X or outside
   └─> onClose() callback
   └─> setShowAiDetailsDrawer(false)
```

---

## 🐛 DÉPANNAGE RAPIDE

| Problème | Cause | Solution |
|----------|-------|----------|
| Drawer vide | Employee null | Vérifier state selectedAiPosteEmployee |
| Pas de suggestions | API error | Check console, vérifier endpoint |
| Styles cassés | CSS non chargé | Import Style.css dans PositionsGrades |
| Suggestionspas refresh | fetchAiSuggestions pas appelée | Vérifier useEffect |
| Assignation échoue | Conflict BD | Backend validation, voir erreur API |
| Scroll ne marche pas | .cnss-form-body overflow | Vérifier CSS .cnss-form-body |

---

## ✨ BONNES PRATIQUES

1. **État:** Tout géré dans PositionsGrades (single source of truth)
2. **Drawer:** Stateless - reçoit données via props
3. **API:** Appels centralisés via fetchAiSuggestions()
4. **Erreurs:** try/catch + Swal.fire() pour UX
5. **Styling:** Classes CSS réutilisables .cnss-*

---

## 📝 MODIFICATION COURANTE

### Ajouter une section au drawer:

1. **Modifier PosteSuggestionsDrawer.jsx**
   ```jsx
   {/* Nouvelle section */}
   <div className="cnss-section-title">
     <Icon size={14} />
     <span>Ma Section</span>
   </div>
   {/* Contenu */}
   ```

2. **Si données de l'API:**
   - Modifier endpoint backend `/postes/{id}/suggestions`
   - Ajouter propriété à employee
   - Extraire et afficher dans drawer

3. **Si données locales:**
   - Passer via props depuis PositionsGrades
   - Utiliser directement dans drawer

---

## 🔗 FICHIERS LIÉS (Même folder)

```
CarriereFormation/
├── PosteSuggestionsDrawer.jsx    ← MAIN
├── PositionsGrades.jsx            ← PARENT
├── CarrieresTable.jsx             (similaire)
├── AddCarriere.jsx                (similaire)
├── AddPoste.jsx
├── SkillsManagement.jsx
├── CareerTraining.css
└── features/
    └── formations/
        ├── SuggestedParticipantsPanel.jsx
        ├── useSmartSuggestions.js
        └── useSuggestedParticipants.js
```

---

## 📚 DOCUMENTATION LIÉE

- [LOCALISATION_PANEL_SUGGESTIONS.md](./LOCALISATION_PANEL_SUGGESTIONS.md) - Vue détaillée complète
- [ARCHITECTURE_PANEL_SUGGESTIONS.md](./ARCHITECTURE_PANEL_SUGGESTIONS.md) - Diagrammes et flux
- [API_REFERENCE_SUGGESTIONS.md](./API_REFERENCE_SUGGESTIONS.md) - Endpoints et data mapping

---

## 👨‍💻 QUICK START CODING

### Ajouter un nouveau bouton au drawer:

```jsx
// Dans PosteSuggestionsDrawer.jsx, après Section
<button 
  onClick={() => { /* action */ }}
  style={{
    backgroundColor: "#2c767c",
    color: "white",
    borderRadius: "8px",
    padding: "8px 16px",
    border: "none"
  }}
>
  Mon Bouton
</button>
```

### Ajouter une action assignation:

```jsx
// Dans PositionsGrades.jsx
const handleCustomAction = useCallback(async (employeeId) => {
  try {
    await apiClient.post(`/postes/${selectedPoste.id}/custom-action`, {
      employe_id: employeeId
    });
    Swal.fire("Succès!", "Action effectuée", "success");
    fetchAiSuggestions(selectedPoste.id);
  } catch (error) {
    Swal.fire("Erreur", error.message, "error");
  }
}, [selectedPoste, fetchAiSuggestions]);
```

---

## 🎯 POINTS CLÉS À RETENIR

1. **PosteSuggestionsDrawer** = Affichage uniquement (stateless)
2. **PositionsGrades** = Logique + État (smart component)
3. **API** = `/postes/{id}/suggestions` retourne employés avec scores
4. **Styles** = Classes `.cnss-*` globalisées
5. **Flux** = User → Click → State → API → Data → Render → Drawer

---

**Dernière mise à jour:** 31 Mars 2026  
**Statut:** ✅ Documenté et opérationnel
