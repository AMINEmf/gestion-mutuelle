# Diagramme d'Architecture - Panel de Suggestions des Postes

## 1. ARCHITECTURE GÉNÉRALE

```
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Laravel (GestionBE)                  │
│  Endpoint: GET /postes/{posteId}/suggestions                    │
│  Endpoint: POST /postes/{posteId}/assign-employe                │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Request/Response
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend React (ProjetFront)                  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PositionsGrades.jsx (Main Container)                 │   │
│  │  - State: showAiDetailsDrawer,                        │   │
│  │           selectedAiPosteEmployee,                    │   │
│  │           aiSuggestions                               │   │
│  │  - Fetch: fetchAiSuggestions()                        │   │
│  │  - Call via apiClient.get()                          │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                            │
│                   ▼                                            │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PosteSuggestionsDrawer.jsx (Display Component)       │   │
│  │  - Props: employee, poste, onClose()                 │   │
│  │  - Displays: Scores, Skills, History                 │   │
│  │  - No API calls (stateless)                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                   │                                            │
│                   ▼ (for styling)                              │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  CSS Classes: .cnss-* (from Style.css)               │   │
│  │  - cnss-side-panel                                   │   │
│  │  - cnss-form-header, cnss-close-btn                  │   │
│  │  - cnss-form-body                                    │   │
│  │  - cnss-section-title                                │   │
│  │  - cnss-field-group                                  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  apiClient.js (Service Layer)                         │   │
│  │  - Gets configured in: apiConfig.js                  │   │
│  │  - Makes all HTTP calls                              │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. HIÉRARCHIE DES COMPOSANTS

```
App
│
├─ PositionsGrades.jsx ⭐ MAIN
│  │
│  ├─ State Management
│  │  ├─ showAiDetailsDrawer: boolean
│  │  ├─ selectedAiPosteEmployee: object
│  │  ├─ selectedPoste: object
│  │  ├─ aiSuggestions: array
│  │  └─ loadingAiSuggestions: boolean
│  │
│  ├─ API Calls
│  │  ├─ fetchAiSuggestions(posteId)
│  │  ├─ fetchPostes()
│  │  ├─ fetchCompetences()
│  │  └─ fetchGrades()
│  │
│  ├─ UI Components
│  │  ├─ SuggestionsList (Affiche aiSuggestions)
│  │  │  └─ Bouton "Voir analyse" 
│  │  │     └─ onClick: setSelectedAiPosteEmployee(emp)
│  │  │        + setShowAiDetailsDrawer(true)
│  │  │
│  │  └─ [CONDITIONAL RENDER]
│  │     └─ PosteSuggestionsDrawer.jsx ⭐
│  │        Props: {employee, poste, onClose}
│  │        │
│  │        ├─ Header
│  │        │  ├─ Title: "Analyse - {employee.name}"
│  │        │  └─ Close Button
│  │        │
│  │        ├─ Body Content
│  │        │  ├─ Section: Information du poste
│  │        │  │  └─ Compétences requises
│  │        │  │
│  │        │  ├─ Section: Score d'Adéquation
│  │        │  │  ├─ Score global (%)
│  │        │  │  ├─ Adéquation des compétences
│  │        │  │  ├─ Compatibilité de grade
│  │        │  │  └─ Ancienneté
│  │        │  │
│  │        │  ├─ Section: Analyse des Compétences
│  │        │  │  └─ Liste des compétences (Match/Partial/Missing)
│  │        │  │
│  │        │  └─ Section: Parcours & Historique
│  │        │     ├─ Historique des postes
│  │        │     └─ Formations suivies
│  │        │
│  │        └─ Elements
│  │           ├─ Progress bars
│  │           ├─ Status badges
│  │           └─ Scrollable containers
│  │
│  └─ Related Components
│     ├─ AddPoste.jsx
│     ├─ EmployeeProfileDrawer (PositionsGrades.jsx intern)
│     └─ Other Career components
│
└─ Global Services
   ├─ apiClient.js
   ├─ apiConfig.js
   └─ CSS
      ├─ Style.css (.cnss-* classes)
      └─ CareerTraining.css
```

---

## 3. FLUX DE DONNÉES

```
╔════════════════════════════════════════════════════════════════╗
║  INITIALISATION                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  1. PositionsGrades mounted                                   ║
║     ↓                                                          ║
║  2. useEffect → fetchPostes() [API: GET /postes]             ║
║     ↓                                                          ║
║  3. Affiche liste des postes dans la table                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────┐
│  INTERACTION UTILISATEUR: VOIR SUGGESTIONS                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Utilisateur clique "Voir suggestions" sur un poste        │
│     ↓                                                          │
│  2. handleOpenSuggestionPanel(poste)                          │
│     └─ setSelectedPoste(poste)                               │
│     └─ setDetailsPosteId(poste.id)                           │
│     └─ setIsSuggestionOpen(true)                             │
│     └─ setShowAiDetailsDrawer(false) [Reset]                 │
│     ↓                                                          │
│  3. useEffect → fetchAiSuggestions(poste.id)                 │
│     │                                                          │
│     └─ API: GET /postes/{posteId}/suggestions                │
│        │                                                       │
│        ├─ Backend Analysis:                                   │
│        │  ├─ Récupère employés du département                │
│        │  ├─ Calcule scores IA par compétences               │
│        │  ├─ Analyse compatibilité grade/ancienneté          │
│        │  └─ Retourne Array[{employee, score, matches...}]  │
│        │                                                       │
│        └─ Frontend:                                           │
│           ├─ setAiSuggestions(data)                          │
│           └─ Affiche liste des suggestions                   │
│     ↓                                                          │
│  4. Utilisateur voit liste avec score et boutons             │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  INTERACTION UTILISATEUR: VOIR DETAILS EMPLOYÉ                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Utilisateur clique "Voir analyse" sur un employé         │
│     ↓                                                          │
│  2. onClick handler:                                          │
│     └─ setSelectedAiPosteEmployee(employee)  [data already]  │
│     └─ setShowAiDetailsDrawer(true)                          │
│     ↓                                                          │
│  3. [CONDITIONAL RENDER] showAiDetailsDrawer === true?        │
│     └─ Oui: Rend le composant PosteSuggestionsDrawer         │
│        │                                                       │
│        └─ <PosteSuggestionsDrawer                            │
│             employee={selectedAiPosteEmployee}               │
│             poste={selectedPoste}                            │
│             onClose={() => {                                 │
│               setShowAiDetailsDrawer(false)                  │
│               setSelectedAiPosteEmployee(null)               │
│             }}                                               │
│           />                                                 │
│     ↓                                                          │
│  4. Drawer affichage:                                         │
│     ├─ Parse employee.ai_score_details                       │
│     ├─ Extrait competence_matches                            │
│     ├─ Affiche historique_postes                             │
│     └─ Affiche formations                                    │
│     ↓                                                          │
│  5. User peut fermer en cliquant:                             │
│     ├─ Bouton X (call onClose())                             │
│     └─ → setShowAiDetailsDrawer(false)                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  INTERACTION UTILISATEUR: ASSIGNER EMPLOYÉ                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Utilisateur clique "Assigner"                             │
│     ↓                                                          │
│  2. handleAssignEmployee(employeeId, name)                   │
│     ↓                                                          │
│  3. API: POST /postes/{poste.id}/assign-employe              │
│     Payload: {employe_id: employeeId}                        │
│     ↓                                                          │
│  4. Backend:                                                 │
│     ├─ Valide l'assignment                                  │
│     ├─ Met à jour la base de données                        │
│     └─ Retourne success                                     │
│     ↓                                                          │
│  5. Frontend:                                                │
│     ├─ Affiche notification succès                          │
│     ├─ Appelle fetchPostes() [Refresh]                      │
│     ├─ Filtre le suggestion de la liste                     │
│     └─ Appelle fetchAiSuggestions() [Refresh]               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. STRUCTURE DES DONNÉES ÉCHANGÉES

```javascript
// API Response: GET /postes/{posteId}/suggestions
{
  "data": [
    {
      "id": 1,
      "full_name": "Jean Dupont",
      "nom": "Dupont",
      "prenom": "Jean",
      "score": 85,                           // Score global (%)
      "ai_score_details": {
        "globalScore": 85,
        "competencesScore": 90,
        "gradeScore": 85,
        "tenureScore": 75
      },
      "competence_matches": [
      │       └── SmartSuggestionScorer.php          [Module formations]
          "skill": "Python",
          "required": true,
          "match_status": "match",            // 'match' | 'partial' | 'missing'
          "niveau_requis": 3,
          "niveau_employe": 3
        },
        {
          "skill": "Java",
          "required": true,
          "match_status": "partial",
          "niveau_requis": 3,
          "niveau_employe": 2
        }
      ],
      "historique_postes": [
        {
          "id": 1,
          "poste_nom": "Développeur Jr",
          "grade_label": "Ingénieur",
          "type_evolution": "Promotion",
          "date_debut": "2021-01-15",
          "date_fin": "2023-06-30",
          "duree": "2 ans 6 mois",
          "statut": "Validé"
        }
      ],
      "formations": [
        {
          "id": 1,
          "intitule": "Python Avancé",
          "organisme": "Coursera",
          "date_debut": "2022-01-01",
          "date_fin": "2022-06-01",
          "duree": "6 mois",
          "statut": "Terminé"
        }
      ]
    }
  ]
}

// API Response: GET /postes (pour selectedPoste)
{
  "data": [
    {
      "id": 1,
      "poste": "Développeur Senior",
      "nom": "Développeur Senior",
      "grade": "Ingénieur",
      "departement_id": 5,
      "raw_competences": [
        {
          "id": 1,
          "competence_id": 10,
          "nom": "Python",
          "label": "Python",
          "name": "Python"
        },
        {
          "id": 2,
          "competence_id": 20,
          "nom": "Architecture Backend",
          "label": "Architecture Backend",
          "name": "Architecture Backend"
        }
      ]
    }
  ]
}
```

---

## 5. CHEMINS D'ACCÈS AUX FICHIERS

```
PROJECT ROOT: c:\wamp64\www\rh-sps-stage\rh-sps-stage\Projet2\

Frontend Structure:
ProjetFront/
├── src/
│   ├── Zakaria/
│   │   ├── Style.css                          [Styles globaux .cnss-*]
│   │   │
│   │   ├── CarriereFormation/
│   │   │   ├── PosteSuggestionsDrawer.jsx     [⭐ MAIN COMPONENT]
│   │   │   ├── PositionsGrades.jsx             [⭐ PARENT CONTAINER]
│   │   │   ├── CarrieresTable.jsx             [Related: EmployeeProfileDrawer]
│   │   │   ├── AddCarriere.jsx                [Related: carrière form]
│   │   │   ├── AddPoste.jsx                   [Related: poste form]
│   │   │   ├── CareerTraining.css             [Related: career styles]
│   │   │   │
│   │   │   └── features/
│   │   │       └── formations/
│   │   │           ├── components/
│   │   │           │   └── SuggestedParticipantsPanel.jsx
│   │   │           ├── useSuggestedParticipants.js
│   │   │           └── useSmartSuggestions.js
│   │   │
│   │   └── cnss/
│   │       └── SectionTitle.jsx
│   │
│   └── services/
│       ├── apiClient.js                       [HTTP client]
│       └── apiConfig.js                       [API config]

Backend Structure:
GestionBE/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── PosteController.php            [Gère suggestions]
│   │   │   └── EmployeController.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── Poste.php
│   │   ├── Employe.php
│   │   └── Competence.php
│   │
│   └── Services/
│       └── SuggestionService.php              [Logiques calcul scores]
│
└── routes/
    └── api.php                                [Enpoints API]
        GET   /postes/{posteId}/suggestions
        POST  /postes/{posteId}/assign-employe
        GET   /postes
        GET   /competences
        GET   /grades
```

---

## 6. POINTS D'INTÉGRATION CRITIQUES

```
┌─────────────────────────────────────────────────────────────────┐
│  INTÉGRATION #1: MISE À JOUR DE DONNÉES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Quand un employé est assigné:                                │
│  1. Backend valide et sauvegarde                              │
│  2. Frontend reçoit succès                                    │
│  3. Appelle fetchPostes() - met à jour positions             │
│  4. Appelle fetchAiSuggestions() - met à jour suggestions    │
│  5. UI se rafraîchit                                          │
│                                                                 │
│  IMPORTANT: Ne pas oublier ces deux appels ou données obsolètes│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INTÉGRATION #2: GESTION DES ERREURS API                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  fetchAiSuggestions:                                           │
│  - Catch: console.error + setAiSuggestions([])                │
│  - Affiche pas l'erreur à l'user mais vide la liste           │
│                                                                 │
│  handleAssignEmployee:                                         │
│  - Catch: Swal.fire() - Affiche erreur à l'user              │
│  - Motif: Action critique = feedback utilisateur nécessaire   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INTÉGRATION #3: GESTION DE L'ÉTAT DU DRAWER                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  showAiDetailsDrawer est fermé quand:                          │
│  - Utilisateur clique X                                       │
│  - Changement de département                                  │
│  - Édition d'un autre poste                                   │
│  - Fermeture du panel de suggestions                          │
│                                                                 │
│  IMPORTANT: Appeler setSelectedAiPosteEmployee(null) aussi    │
│  pour éviter les données résiduelles                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. POINTS DE MODIFICATION COURANTS

Si vous devez modifier le panel:

```javascript
// 1. Ajouter un nouvelle section:
//    → Modifier PosteSuggestionsDrawer.jsx
//    → Ajouter nouveaux props dans PositionsGrades si données viennent de l'API
//    → Si API: ajouter nouvelles propriétés à employee ou poste

// 2. Changer l'endpoint API:
//    → Modifier PositionsGrades.jsx ligne ~231 (fetchAiSuggestions)
//    → Ajouter/retirer des propriétés dans le parsing de response

// 3. Ajouter un nouvel état/bouton:
//    → Ajouter state dans PositionsGrades.jsx
//    → Passer via props à PosteSuggestionsDrawer
//    → Implémenter la logique dans PositionsGrades

// 4. Modifier les styles:
//    → Classes CSS globales: Style.css (.cnss-* classes)
//    → Styles inline: dans PosteSuggestionsDrawer.jsx
//    → Styles composant: CareerTraining.css

// 5. Ajouter validation/messages:
//    → Frontend: Swal.fire() pour alerts utilisateur
//    → Backend: Réponse API avec messages d'erreur détaillés
```

---

## Version finale: Résumé court

**Fichiers essentiels (à consulter en priorité):**
1. `PosteSuggestionsDrawer.jsx` - Le drawer lui-même
2. `PositionsGrades.jsx` - Le gestionnaire d'état/API
3. `Style.css` - Les styles (.cnss-*)
4. `apiClient.js` - Le client HTTP

**Points clés:**
- Composant stateless affichage + Container stateful logique
- API call via `/postes/{id}/suggestions`
- État géré totalement dans PositionsGrades
- Styles globalisés avec conventions .cnss-*
