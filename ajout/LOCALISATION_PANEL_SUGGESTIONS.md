# Localisation du Panel de Suggestions des Postes

## Vue d'ensemble
Le panel de suggestion des postes est un composant qui affiche une analyse détaillée de l'adéquation entre un employé et un poste, avec scores IA, compétences requises, historique de carrière et formations.

---

## 1. COMPOSANT PRINCIPAL

### 📄 [PosteSuggestionsDrawer.jsx](ProjetFront/src/Zakaria/CarriereFormation/PosteSuggestionsDrawer.jsx)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\Zakaria\CarriereFormation\PosteSuggestionsDrawer.jsx`

**Description:** Composant React qui affiche un drawer (panneau latéral) avec:
- Information du poste sélectionné
- Compétences requises pour le poste
- Score d'adéquation global (%)
- Analyse des compétences (Adéquation, Compatibilité grade, Ancienneté)
- Détail des compétences (Validée/Partielle/Manquante)
- Historique des postes de l'employé
- Formations suivies

**Props:**
- `employee` - Objet employé avec propriétés: `full_name`, `nom`, `prenom`, `ai_score_details`, `competence_matches`, `historique_postes`, `formations`
- `poste` - Objet poste avec: `poste`, `nom`, `raw_competences`
- `onClose` - Fonction callback pour fermer le drawer

**Styles CSS:** Classes utilisées
- `.cnss-side-panel` - Conteneur principal
- `.cnss-form-header` - En-tête avec titre et bouton fermeture
- `.cnss-form-body` - Corps scrollable
- `.cnss-section-title` - Titres de sections
- `.cnss-field-group` - Groupe de champs
- `.cnss-form-label` - Labels
- `.parcours-historique-scroll` - Classe custom scrollbar

---

## 2. FICHIER PARENT/CONTENEUR

### 📄 [PositionsGrades.jsx](ProjetFront/src/Zakaria/CarriereFormation/PositionsGrades.jsx)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\Zakaria\CarriereFormation\PositionsGrades.jsx`

**Description:** Composant React principal qui gère:
- Liste des postes par département
- Suggestions IA pour chaque poste
- Gestion des états du drawer de suggestions
- Intégration du composant PosteSuggestionsDrawer

**Imports pertinents:**
```javascript
import PosteSuggestionsDrawer from "./PosteSuggestionsDrawer";
```

**États pertinents dans le composant:**
```javascript
const [showAiDetailsDrawer, setShowAiDetailsDrawer] = useState(false);
const [selectedAiPosteEmployee, setSelectedAiPosteEmployee] = useState(null);
const [selectedPoste, setSelectedPoste] = useState(null);
const [aiSuggestions, setAiSuggestions] = useState([]);
const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);
```

**Fonctions clés:**
- `fetchAiSuggestions(posteId)` - Récupère les suggestions IA via l'API
- `handleOpenSuggestionPanel(poste)` - Ouvre le panel de suggestions
- `handleCloseSuggestionPanel()` - Ferme le panel
- `handleAssignEmployee(employeeId, employeeName)` - Assigne un employé au poste

**Points d'appel du drawer:**
- Ligne ~1587-1591: Rendu conditionnel du composant
```jsx
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

---

## 3. ENDPOINTS API

### 📡 GET `/postes/{posteId}/suggestions`
**Backend:** Backend Laravel (GestionBE)

**Description:** Récupère les suggestions d'employés pour un poste spécifique

**Implémentation frontend:**
```javascript
const fetchAiSuggestions = useCallback(async (posteId) => {
  if (!posteId) return;
  setLoadingAiSuggestions(true);
  try {
    const response = await apiClient.get(`/postes/${posteId}/suggestions`);
    const payload = response?.data?.data ?? response?.data ?? [];
    const rows = Array.isArray(payload) ? payload : [];
    setAiSuggestions(rows);
  } catch (error) {
    console.error("AI_SUGGESTIONS_ERROR", error);
    setAiSuggestions([]);
  } finally {
    setLoadingAiSuggestions(false);
  }
}, []);
```

**Autres endpoints utilisés:**
- `POST /postes/{posteId}/assign-employe` - Assigne un employé au poste
- `GET /competences` - Récupère les compétences
- `GET /grades` - Récupère les grades
- `GET /postes` - Récupère les postes

---

## 4. FICHIERS DE CONFIGURATION & SERVICES

### 📄 [apiClient.js](ProjetFront/src/services/apiClient.js)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\services\apiClient.js`

**Description:** Client API configuré pour effectuer les requêtes HTTP

**Utilisation:**
```javascript
import apiClient from "../../services/apiClient";
// Puis utiliser: apiClient.get(), apiClient.post(), etc.
```

### 📄 [apiConfig.js](ProjetFront/src/services/apiConfig.js)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\services/apiConfig.js`

**Description:** Configuration de base de l'API

---

## 5. STYLES & THÈME

### 📄 [CareerTraining.css](ProjetFront/src/Zakaria/CarriereFormation/CareerTraining.css)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\Zakaria\CarriereFormation\CareerTraining.css`

**Description:** Feuille de styles pour les composants de carrière/formations

### 📄 [Style.css](ProjetFront/src/Zakaria/Style.css)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\Zakaria\Style.css`

**Description:** Styles globaux, incluant les classes `.cnss-*`

---

## 6. FICHIERS CONNEXES (Même dossier)

### 📄 [CarrieresTable.jsx](ProjetFront/src/Zakaria/CarriereFormation/CarrieresTable.jsx)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\Zakaria\CarriereFormation\CarrieresTable.jsx`

**Description:** Exporte le composant `EmployeeProfileDrawer` utilisé par PositionsGrades
- Utilise aussi les mêmes classes CSS (.cnss-*)

### 📄 [AddCarriere.jsx](ProjetFront/src/Zakaria/CarriereFormation/AddCarriere.jsx)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\Zakaria\CarriereFormation\AddCarriere.jsx`

**Description:** Composant pour ajouter/modifier une carrière
- Utilise aussi les mêmes classes CSS (.cnss-*)

### 📄 [AddPoste.jsx](ProjetFront/src/Zakaria/CarriereFormation/AddPoste.jsx)
**Localisation:** `c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\ProjetFront\src\Zakaria\CarriereFormation\AddPoste.jsx`

**Description:** Composant pour ajouter/modifier un poste

---

## 7. STRUCTURE DE DONNÉES

### Structure de l'objet `employee` dans PosteSuggestionsDrawer:
```javascript
{
  full_name: string,
  nom: string,
  prenom: string,
  score: number (optional),
  ai_score_details: {
    globalScore: number,
    competencesScore: number,
    gradeScore: number,
    tenureScore: number
  },
  competence_matches: [
    {
      skill: string,
      required: boolean,
      match_status: 'match' | 'partial' | 'missing',
      niveau_requis: number,
      niveau_employe: number
    }
  ],
  historique_postes: [
    {
      id: number,
      poste_nom: string,
      grade_label: string,
      type_evolution: string,
      date_debut: date,
      date_fin: date,
      duree: string,
      statut: string
    }
  ],
  formations: [
    {
      id: number,
      intitule: string,
      organisme: string,
      date_debut: date,
      date_fin: date,
      duree: string,
      statut: string
    }
  ]
}
```

### Structure de l'objet `poste`:
```javascript
{
  id: number,
  poste: string,
  nom: string,
  raw_competences: [
    {
      id: number,
      competence_id: number,
      nom: string,
      label: string,
      name: string
    }
  ]
}
```

---

## 8. FLUX D'UTILISATION

### Scénario principal:
1. **Affichage initial:** PositionsGrades affiche la liste des postes
2. **Clic sur "Voir suggestions":** Appel à `handleOpenSuggestionPanel(poste)`
3. **Fetch API:** `fetchAiSuggestions(posteId)` récupère les suggestions
4. **Affichage liste:** Les employés suggérés s'affichent
5. **Clic "Voir analyse":** `setSelectedAiPosteEmployee(employee)` + `setShowAiDetailsDrawer(true)`
6. **Rendu drawer:** PosteSuggestionsDrawer s'affiche avec les détails
7. **Fermeture:** `onClose()` callback lie à `setShowAiDetailsDrawer(false)`

### Points d'interaction:
- **Bouton "Voir analyse"** dans la liste des suggestions → Ouvre le drawer
- **Bouton X** dans le header du drawer → Ferme le drawer (call `onClose()`)
- **Bouton "Assigner"** → Appelle `handleAssignEmployee()` et met à jour les suggestions

---

## 9. FICHIERS SUPPLÉMENTAIRES CONNEXES

### Composants similaires utilisants les mêmes classes CSS:
- [SuggestedParticipantsPanel.jsx](ProjetFront/src/Zakaria/CarriereFormation/features/formations/components/SuggestedParticipantsPanel.jsx)
- Structure de drawer partagée pour cohérence UI

### Hooks personnalisés liés:
- [useSuggestedParticipants.js](ProjetFront/src/Zakaria/CarriereFormation/features/formations/useSuggestedParticipants.js)
- [useSmartSuggestions.js](ProjetFront/src/Zakaria/CarriereFormation/features/formations/useSmartSuggestions.js)

---

## 10. RÉSUMÉ DES DÉPENDANCES

### NPM Packages utilisés dans PosteSuggestionsDrawer:
- `react` - Framework principal
- `lucide-react` - Icônes (X, User, Award, TrendingUp)

### NPM Packages utilisés dans PositionsGrades:
- `react` - Framework principal
- `@mui/material` - Composants Material UI
- `react-bootstrap` - Composants Bootstrap
- `@fortawesome/react-fontawesome` - Icônes FontAwesome
- `sweetalert2` - Alertes modales
- `framer-motion` - Animations
- `react-icons` - Icônes supplémentaires

---

## Arborescence optimale pour navigation:

```
ProjetFront/
├── src/
│   ├── services/
│   │   ├── apiClient.js ← Configuration API
│   │   └── apiConfig.js
│   ├── Zakaria/
│   │   ├── Style.css ← Styles globaux (.cnss-*)
│   │   └── CarriereFormation/
│   │       ├── PosteSuggestionsDrawer.jsx ← COMPOSANT PRINCIPAL
│   │       ├── PositionsGrades.jsx ← COMPOSANT PARENT
│   │       ├── CarrieresTable.jsx ← Drawer employés
│   │       ├── AddCarriere.jsx ← Formulaire carrière
│   │       ├── AddPoste.jsx ← Formulaire poste
│   │       ├── CareerTraining.css ← Styles spécifiques
│   │       └── features/
│   │           ├── formations/
│   │           │   ├── components/SuggestedParticipantsPanel.jsx
│   │           │   ├── useSuggestedParticipants.js
│   │           │   └── useSmartSuggestions.js
```

---

## Points clés à retenir:

1. **PosteSuggestionsDrawer** est un composant stateless qui affiche uniquement les données
2. **PositionsGrades** gère tout l'état et la logique métier
3. L'API endpoint `/postes/{posteId}/suggestions` alimente les données
4. Les styles sont globalisés avec les classes `.cnss-*`
5. Le flux est bidirectionnel: API → UI → utilisateur → API → UI
