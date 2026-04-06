# 🗺️ Vue Visuelle Complète - Panel de Suggestions

## MIND MAP - Structure Globale

```
┌─────────────────────────────────────────────────────────────────────┐
│         PANEL DE SUGGESTIONS DES POSTES - STRUCTURE COMPLÈTE        │
└─────────────────────────────────────────────────────────────────────┘

                              ┌───────────────────┐
                              │   UTILISATEUR     │
                              │   Page Postes     │
                              └────────┬──────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
        ┌─────────────────┐   ┌─────────────────┐   ┌─────────────┐
        │ Voir Suggestions│   │ Sélectionner    │   │ Assigner    │
        │ Button          │   │ Département     │   │ Employé     │
        └────────┬────────┘   └─────────────────┘   └──────┬──────┘
                 │                                         │
                 │  handleOpenSuggestionPanel()           │
                 │                                    handleAssignEmployee()
                 │                                         │
                 ├─→ setSelectedPoste()                    │
                 ├─→ setIsSuggestionOpen(true)            │
                 │                                         │
                 ▼                                         ▼
        ┌──────────────────────────────────────────────────────────┐
        │          PositionsGrades.jsx (Smart Component)          │
        │                                                          │
        │  State:                                                 │
        │  ├─ showAiDetailsDrawer                                │
        │  ├─ selectedAiPosteEmployee                            │
        │  ├─ selectedPoste                                      │
        │  ├─ aiSuggestions []                                   │
        │  ├─ loadingAiSuggestions                              │
        │  └─ 15+ autres states                                 │
        │                                                          │
        │  API Calls:                                            │
        │  ├─ fetchAiSuggestions(posteId)                       │
        │  ├─ fetchPostes()                                     │
        │  ├─ fetchCompetences()                                │
        │  ├─ handleAssignEmployee()                            │
        │  └─ 5+ autres functions                               │
        └────────┬──────────────────────────┬─────────────────┘
                 │                          │
          useEffect trigger       Conditional Render
                 │                          │
                 ▼                          ▼
        ┌─────────────────────┐   ┌───────────────────────────┐
        │ Fetch Suggestions   │   │ IF showAiDetailsDrawer    │
        │ GET /postes/{id}/   │   │    && selectedEmployee    │
        │ suggestions         │   │    && selectedPoste       │
        │                     │   │ THEN render:             │
        │ setAiSuggestions()  │   │                          │
        └──────────┬──────────┘   └────────┬──────────────────┘
                   │                       │
                   ▼                       ▼
        ┌─────────────────────┐   ┌──────────────────────────────┐
        │ Suggestions List    │   │ PosteSuggestionsDrawer.jsx   │
        │ ├─ Employee 1: 85%  │   │ (Presentational Component)   │
        │ ├─ Employee 2: 75%  │   │                              │
        │ ├─ Employee 3: 65%  │   │ Props:                       │
        │ └─ ...              │   │ ├─ employee                  │
        │                     │   │ ├─ poste                     │
        │ Boutons:            │   │ └─ onClose()                │
        │ ├─ Voir analyse     │   │                              │
        │ └─ Assigner         │   │ Renders:                     │
        │                     │   │ ├─ Header                    │
        │ Click "Voir         │   │ ├─ Poste Info               │
        │ analyse" ──────┐    │   │ ├─ Scores                   │
        │                │    │   │ ├─ Compétences             │
        │                │    │   │ ├─ Historique              │
        └─────────────────────┘   │ └─ Formations              │
                                  └──────────┬──────────────────┘
                                             │
            ┌─────────────────────────────┐  │
            │ setSelectedAiPosteEmployee()│◄─┘
            │ setShowAiDetailsDrawer()    │
            └─────────────────────────────┘
                                             
                                  ┌─────────────────┐
                                  │ User interacts: │
                                  │ - Scroll lists  │
                                  │ - Voir postes   │
                                  │ - Voir form     │
                                  │ - Click X       │
                                  └────────┬────────┘
                                           │
                                    onClose callback
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │ setShowAi...    │
                                  │ (false)         │
                                  └─────────────────┘
```

---

## DIAGRAMME EN COUCHES

```
┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 1: PRÉSENTATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PosteSuggestionsDrawer.jsx                             │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ .cnss-side-panel                                  │   │   │
│  │  │  ┌────────────────────────────────────────────┐   │   │   │
│  │  │  │ .cnss-form-header [Employee Name] [X]     │   │   │   │
│  │  │  │ .cnss-close-btn                           │   │   │   │
│  │  │  ├────────────────────────────────────────────┤   │   │   │
│  │  │  │ .cnss-form-body (scrollable)              │   │   │   │
│  │  │  │  ├─ .cnss-section-title                   │   │   │   │
│  │  │  │  │  Poste Info                            │   │   │   │
│  │  │  │  ├─ Score d'Adéquation                    │   │   │   │
│  │  │  │  │  ├─ Barre progrès 85%                  │   │   │   │
│  │  │  │  │  └─ Détails (Compétences, Grade, etc) │   │   │   │
│  │  │  │  ├─ Analyse Compétences                   │   │   │   │
│  │  │  │  │  Scroll list de skills                 │   │   │   │
│  │  │  │  ├─ Historique Postes                     │   │   │   │
│  │  │  │  │  Scroll history                        │   │   │   │
│  │  │  │  └─ Formations                            │   │   │   │
│  │  │  │     Scroll trainings                      │   │   │   │
│  │  │  └────────────────────────────────────────────┘   │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 2: LOGIQUE MÉTIER                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PositionsGrades.jsx - State Management                │   │
│  │                                                         │   │
│  │  States:                                                │   │
│  │  ├─ showAiDetailsDrawer: false → true → false          │   │
│  │  ├─ selectedAiPosteEmployee: null → employee → null    │   │
│  │  ├─ selectedPoste: null → poste → null                 │   │
│  │  ├─ aiSuggestions: [] → employees[] → []              │   │
│  │  └─ loadingAiSuggestions: false → true → false        │   │
│  │                                                         │   │
│  │  Functions:                                             │   │
│  │  ├─ handleOpenSuggestionPanel() - State setters        │   │
│  │  ├─ handleCloseSuggestionPanel() - Reset states        │   │
│  │  ├─ handleAssignEmployee() - API POST                 │   │
│  │  ├─ fetchAiSuggestions() - API GET                    │   │
│  │  └─ 20+ autres (fetch, filter, select, etc)           │   │
│  │                                                         │   │
│  │  Effects:                                               │   │
│  │  ├─ useEffect on isSuggestionOpen → fetch suggestions │   │
│  │  ├─ useEffect on detailsPosteId → fetch suggestions   │   │
│  │  └─ useEffect on mount → fetch toutd                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 3: COMMUNICATION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  apiClient.js & Services                               │   │
│  │                                                         │   │
│  │  ├─ Axios instance configuré                           │   │
│  │  ├─ Base URL: http://127.0.0.1:8000/api                │   │
│  │  ├─ Headers: Authorization, Content-Type              │   │
│  │  └─ Interceptors: Error handling                       │   │
│  │                                                         │   │
│  │  Endpoints:                                             │   │
│  │  ├─ GET /postes/{id}/suggestions                       │   │
│  │  ├─ POST /postes/{id}/assign-employe                  │   │
│  │  ├─ GET /postes                                        │   │
│  │  ├─ GET /competences                                   │   │
│  │  ├─ GET /grades                                        │   │
│  │  └─ GET /departements/hierarchy                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 4: BACKEND API                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Laravel Backend (GestionBE)                            │   │
│  │                                                         │   │
│  │  PosteController.php:                                   │   │
│  │  ├─ suggestions() method                                │   │
│  │  │  ├─ Fetch poste                                      │   │
│  │  │  ├─ Fetch employees (same dept)                      │   │
│  │  │  ├─ Calculate AI scores                              │   │
│  │  │  ├─ Match competences                                │   │
│  │  │  └─ Return sorted results                            │   │
│  │  │                                                      │   │
│  │  ├─ assignEmploye() method                              │   │
│  │  │  ├─ Validate inputs                                  │   │
│  │  │  ├─ Update assignment                                │   │
│  │  │  └─ Return success                                   │   │
│  │  │                                                      │   │
│  │  Database:                                              │   │
│  │  ├─ postes table                                        │   │
│  │  ├─ employes table                                      │   │
│  │  ├─ competences table                                   │   │
│  │  ├─ assignments table                                   │   │
│  │  └─ formations table                                    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## DIAGRAMME SÉQUENCE - Flux complet

```
User              Browser           PositionsGrades    Backend API
 │                  │                    │                 │
 ├─ Clic "Voir"─────>                    │                 │
 │                  │  handleOpen...      │                 │
 │                  │──────────────────>  │                 │
 │                  │  setState           │                 │
 │                  │                     │                 │
 │                  │ useEffect trigger   │                 │
 │                  │                     │ GET /postes/.../│
 │                  │                     │──────────────>  │
 │                  │                     │                 │ Calculate
 │                  │                     │                 │  scores
 │                  │                     │    Response     │
 │                  │                     │<──────────────  │
 │                  │  setAiSuggestions   │                 │
 │                  │  Re-render          │                 │
 │                  │                     │                 │
 ├─ Clic "Analyse"──>                    │                 │
 │                  │ onClick handler     │                 │
 │                  │──────────────────>  │                 │
 │                  │ setState showDrawer │                 │
 │                  │ Re-render drawer    │                 │
 │                  │                     │                 │
 │  [Drawer shows]  │                     │                 │
 │                  │                     │                 │
 │  User scrolls    │                     │                 │
 │  and reads       │                     │                 │
 │                  │                     │                 │
 ├─ Clic "Assigner"─>                    │                 │
 │                  │ onClick handler     │                 │
 │                  │──────────────────>  │                 │
 │                  │ handleAssign...     │                 │
 │                  │ POST /postes/.../   │                 │
 │                  │ assign-employe      │                 │
 │                  │                     │──────────────>  │
 │                  │                     │                 │ Update DB
 │                  │                     │    Success      │
 │                  │                     │<──────────────  │
 │                  │ Swal notification   │                 │
 │                  │ Fetch updated data  │                 │
 │                  │ Re-render           │                 │
 │                  │                     │                 │
 ├─ Clic X ─────────>                    │                 │
 │                  │ onClose callback    │                 │
 │                  │──────────────────>  │                 │
 │                  │ setState false      │                 │
 │                  │ Un-render drawer    │                 │
 │                  │                     │                 │
 └─ End            └─                    └─                └─
```

---

## ARBORESCENCE DE FICHIERS

```
PROJET ROOT: c:\wamp64\www\rh-sps-stage\Projet2
│
├── ProjetFront/
│   └── src/
│       ├── services/
│       │   ├── apiClient.js                    [Client HTTP]
│       │   └── apiConfig.js                    [Config]
│       │
│       ├── Zakaria/
│       │   ├── Style.css                       [CSS .cnss-*]
│       │   │
│       │   └── CarriereFormation/
│       │       ├── PosteSuggestionsDrawer.jsx  [⭐ DRAWER]
│       │       ├── PositionsGrades.jsx         [⭐ PARENT]
│       │       ├── CarrieresTable.jsx
│       │       ├── AddCarriere.jsx
│       │       ├── AddPoste.jsx
│       │       ├── CareerTraining.css
│       │       │
│       │       └── features/
│       │           └── formations/
│       │               ├── components/
│       │               │   └── SuggestedParticipantsPanel.jsx
│       │               ├── useSuggestedParticipants.js
│       │               └── useSmartSuggestions.js
│       │
│       └── [autres composants...]
│
├── GestionBE/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── PosteController.php             [API suggestions]
│   │   ├── Models/
│   │   │   ├── Poste.php
│   │   │   ├── Employe.php
│   │   │   └── Competence.php
│   │   └── Services/
│   │       └── SmartSuggestionScorer.php         [Module formations]
│   │
│   ├── database/
│   │   └── migrations/
│   │       ├── postes_table
│   │       ├── employes_table
│   │       ├── competences_table
│   │       └── assignments_table
│   │
│   └── routes/
│       └── api.php                             [Endpoints]
│
└── Documentation/
    ├── INDEX_PANEL_SUGGESTIONS.md              [Navigation]
    ├── QUICK_REFERENCE_SUGGESTIONS.md          [Accès rapide]
    ├── LOCALISATION_PANEL_SUGGESTIONS.md       [Fichiers complets]
    ├── ARCHITECTURE_PANEL_SUGGESTIONS.md       [Diagrammes]
    └── API_REFERENCE_SUGGESTIONS.md            [API détail]
```

---

## CYCLE VIE - État et Render

```
┌─────────────────────────────────────┐
│  Initial State                      │
├─────────────────────────────────────┤
│ showAiDetailsDrawer: false          │
│ selectedAiPosteEmployee: null       │
│ selectedPoste: null                 │
│ aiSuggestions: []                   │
│ loadingAiSuggestions: false         │
│ ...                                 │
└──────────────┬──────────────────────┘
               │
               ▼
    [User interacts]
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
┌─────┐   ┌────────┐  ┌───────┐  ┌─────┐
│View │   │View    │  │View   │  │Dept │
│Sugg │   │Analyse │  │Close  │  │ Change
└──┬──┘   └────┬───┘  └───┬───┘  └──┬──┘
   │           │          │         │
   ▼           ▼          ▼         ▼
  [1]         [2]        [3]       [4]
   │           │          │         │
   │  State    │          │         │
   │  changes  │          │         │
   ▼           ▼          ▼         ▼
 Fetch     Set Drawer   Close    AllReset
 Sugg      Details      Drawer   Drawers
   │           │          │         │
   └────────┬──┴────────┬─┴───────┬─┘
            │           │         │
            ▼           ▼         ▼
      [Re-Render]  [Re-Render]  [Re-Render]
            │           │         │
            └────┬──────┴──────┬──┘
                 │             │
                 ▼             ▼
         [Update DOM]  [User sees changes]
```

---

## COMPOSANT PROPS FLOW

```
COMPONENT TREE:
    
PositionsGrades (Smart)
│
├─ State & Logic
│  ├─ showAiDetailsDrawer
│  ├─ selectedAiPosteEmployee
│  └─ selectedPoste
│
└─> Conditional Render
    │
    └─ {showAiDetailsDrawer && ... && (
        │
        └─> PosteSuggestionsDrawer (Presentational)
            │
            Props:
            ├─ employee = {
            │   ├─ full_name
            │   ├─ ai_score_details
            │   ├─ competence_matches
            │   ├─ historique_postes
            │   └─ formations
            │ }
            │
            ├─ poste = {
            │   ├─ id
            │   ├─ poste
            │   └─ raw_competences
            │ }
            │
            └─ onClose = () => {
                 setShowAiDetailsDrawer(false)
                 setSelectedAiPosteEmployee(null)
               }


CONTENT FLOW:

employee.ai_score_details.globalScore → Score bar (85%)
                ↓
                Shows in header "Analyse - Jean Dupont"
                
employee.competence_matches[] → Competences list
                ↓
                Maps to skill items with status badges
                
employee.historique_postes[] → History section
                ↓
                Scrollable list of past positions
                
employee.formations[] → Formations section
                ↓
                Scrollable list of trainings
```

---

## DÉCISION TREE - Quand afficher le drawer?

```
           START
             │
             ▼
    showAiDetailsDrawer?
         /       \
       YES        NO
        │          └─> Don't render
        │
        ▼
    selectedAiPosteEmployee?
         /       \
       YES        NO
        │          └─> Don't render
        │
        ▼
    selectedPoste?
         /       \
       YES        NO
        │          └─> Don't render
        │
        ▼
    [RENDER DRAWER]
        │
        ├─ Has Header
        ├─ Has Body content
        └─ Has Scrollable sections
```

---

## PERFORMANCE & OPTIMIZATIONS

```
┌─────────────────────────────────────────┐
│     OPTIMIZATION TECHNIQUES             │
├─────────────────────────────────────────┤
│                                         │
│  ✓ useCallback for functions            │
│    └─ Prevent re-renders of children    │
│                                         │
│  ✓ useMemo for computed values          │
│    └─ Expensive calculations cached     │
│                                         │
│  ✓ Lazy loading of suggestions          │
│    └─ Only fetch when needed            │
│                                         │
│  ✓ Virtual scrolling (potential)        │
│    └─ For large lists                   │
│                                         │
│  ✓ CSS containment                      │
│    └─ .cnss-form-body: contain:layout   │
│                                         │
└─────────────────────────────────────────┘
```

---

Fin de la vue visuelle complète.  
Voir aussi: [INDEX_PANEL_SUGGESTIONS.md](./INDEX_PANEL_SUGGESTIONS.md)
