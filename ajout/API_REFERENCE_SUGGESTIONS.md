# API Reference & Data Mapping

## 1. ENDPOINTS API UTILISÉS

### 1.1 Suggestions d'employés
**Endpoint:** `GET /postes/{posteId}/suggestions`

**Appelé par:** `PositionsGrades.jsx` - fonction `fetchAiSuggestions(posteId)`

**Implémentation:**
```javascript
const fetchAiSuggestions = useCallback(async (posteId) => {
  if (!posteId) return;
  setLoadingAiSuggestions(true);
  try {
    const response = await apiClient.get(`/postes/${posteId}/suggestions`);
    const payload = response?.data?.data ?? response?.data ?? [];
    const rows = Array.isArray(payload) ? payload : [];
    setAiSuggestions(rows);  // Stocké dans state
  } catch (error) {
    console.error("AI_SUGGESTIONS_ERROR", error);
    setAiSuggestions([]);
  } finally {
    setLoadingAiSuggestions(false);
  }
}, []);
```

**Quand?** Déclenché par `handleOpenSuggestionPanel()` quand utilisateur clique "Voir suggestions"

**Réponse attendue:**
```json
{
  "data": [
    {
      "id": 1,
      "employee_id": 1,
      "full_name": "Jean Dupont",
      "nom": "Dupont",
      "prenom": "Jean",
      "score": 85,
      "ai_score_details": {
        "globalScore": 85,
        "competencesScore": 90,
        "gradeScore": 85,
        "tenureScore": 75
      },
      "competence_matches": [...],
      "historique_postes": [...],
      "formations": [...]
    }
  ]
}
```

---

### 1.2 Assignation d'employé
**Endpoint:** `POST /postes/{posteId}/assign-employe`

**Appelé par:** `PositionsGrades.jsx` - fonction `handleAssignEmployee(employeeId, employeeName)`

**Implémentation:**
```javascript
const handleAssignEmployee = useCallback(async (employeeId, employeeName) => {
  if (!selectedPoste?.id) {
    Swal.fire("Attention", "Veuillez sélectionner un poste.", "warning");
    return;
  }

  setAssigningEmployeeId(employeeId);
  try {
    await apiClient.post(`/postes/${selectedPoste.id}/assign-employe`, {
      employe_id: employeeId
    });
    
    Swal.fire({
      title: "Succès",
      text: `L'employé ${employeeName} a été assigné au poste avec succès.`,
      icon: "success",
      timer: 2000
    });
    
    fetchPostes();
    setAiSuggestions((prev) =>
      prev.filter((employee) => (employee.id ?? employee.employee_id) !== employeeId)
    );
    fetchAiSuggestions(selectedPoste.id);
    
  } catch (error) {
    console.error("ASSIGN_ERROR", error);
    Swal.fire("Erreur", "Impossible d'assigner l'employé.", "error");
  } finally {
    setAssigningEmployeeId(null);
  }
}, [selectedPoste, fetchPostes, fetchAiSuggestions]);
```

**Quand?** Déclenché au clic du bouton "Assigner" dans la liste des suggestions

**Payload:**
```json
{
  "employe_id": 1
}
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Employé assigné avec succès"
}
```

---

### 1.3 Liste des postes
**Endpoint:** `GET /postes`

**Appelé par:** `PositionsGrades.jsx` - fonction `fetchPostes()`

**Implémentation:**
```javascript
const fetchPostes = useCallback(async () => {
  setLoadingPositions(true);
  try {
    const response = await apiClient.get("/postes");
    const payload = response?.data?.data ?? response?.data ?? [];
    const rows = Array.isArray(payload) ? payload : [];
    setPositions(rows);
  } catch (error) {
    // Error handling...
  } finally {
    setLoadingPositions(false);
  }
}, []);
```

**Quand?** Au chargement initial + après validation d'assignation

**Réponse attendue:**
```json
{
  "data": [
    {
      "id": 1,
      "poste": "Développeur Senior",
      "nom": "Développeur Senior",
      "grade": "Ingénieur",
      "domaine": "Informatique",
      "departement_id": 5,
      "statut": "Active",
      "niveau": "Senior",
      "raw_competences": [
        {
          "id": 1,
          "competence_id": 10,
          "nom": "Python",
          "label": "Python"
        }
      ]
    }
  ]
}
```

---

### 1.4 Liste des compétences
**Endpoint:** `GET /competences`

**Appelé par:** `PositionsGrades.jsx` - fonction `fetchCompetences()`

**Implémentation:**
```javascript
const fetchCompetences = useCallback(async () => {
  setLoadingCompetences(true);
  try {
    const response = await apiClient.get("/competences");
    const payload = response?.data?.data ?? response?.data ?? [];
    setCompetencesData(Array.isArray(payload) ? payload : []);
  } catch (error) {
    console.error("COMPETENCES_API_ERROR", error);
    setCompetencesData([]);
  } finally {
    setLoadingCompetences(false);
  }
}, []);
```

**Quand?** Au chargement du composant (useEffect)

**Réponse attendue:**
```json
{
  "data": [
    {
      "id": 1,
      "nom": "Python",
      "label": "Python",
      "description": "Langage de programmation"
    }
  ]
}
```

---

### 1.5 Liste des grades
**Endpoint:** `GET /grades`

**Appelé par:** `PositionsGrades.jsx` - fonction `fetchGrades()`

**Implémentation:**
```javascript
const fetchGrades = useCallback(async () => {
  setLoadingGrades(true);
  try {
    const response = await apiClient.get('/grades');
    const data = response.data?.data ?? response.data ?? [];
    setGrades(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("GRADES_API_ERROR", error);
    setGrades([]); 
  } finally {
    setLoadingGrades(false);
  }
}, []);
```

**Quand?** Au chargement du composant (useEffect)

**Réponse attendue:**
```json
{
  "data": [
    {
      "id": 1,
      "nom": "Ingénieur",
      "label": "Ingénieur",
      "level": 3
    }
  ]
}
```

---

### 1.6 Hiérarchie des départements
**Endpoint:** `GET /departements/hierarchy`

**Appelé par:** `PositionsGrades.jsx` - fonction `fetchDepartmentHierarchy()`

**Implémentation:**
```javascript
const fetchDepartmentHierarchy = async () => {
  const applyTree = (rawItems) => {
    const normalized = normalizeDepartmentTree(rawItems);
    if (!hasDepartments(normalized)) return false;
    setDepartements(normalized);
    localStorage.setItem("departmentHierarchy", JSON.stringify(normalized));
    return true;
  };

  try {
    const response = await apiClient.get("/departements/hierarchy");
    const data = response?.data?.data ?? response?.data ?? [];
    if (applyTree(data)) return;
  } catch (error) {
    // Fallback...
  }
};
```

**Quand?** Au chargement du composant (useEffect)

**Réponse attendue:**
```json
{
  "data": [
    {
      "id": 1,
      "nom": "IT",
      "children": [
        {
          "id": 2,
          "nom": "Backend",
          "children": []
        }
      ]
    }
  ]
}
```

---

## 2. FLOW DE DONNÉES DÉTAILLÉ

### Flow 1: Affichage d'un poste et ses suggestions

```
User clicks "Voir suggestions" on Poste X
          ↓
PositionsGrades.handleOpenSuggestionPanel(poste)
  setSelectedPoste(poste)
  setDetailsPosteId(poste.id)
  setIsSuggestionOpen(true)
  setShowAiDetailsDrawer(false)
          ↓
useEffect([isSuggestionOpen, detailsPosteId])
  fetchAiSuggestions(detailsPosteId)
          ↓
API Call: GET /postes/{posteId}/suggestions
          ↓
Backend:
  1. Fetch Poste(id)
  2. Fetch all Employes in departement
  3. For each Employe:
     - Calculate AI scores (competences, grade, tenure)
     - Match competences required vs employee's
     - Build response object
  4. Return sorted by score DESC
          ↓
Frontend receives response.data.data
  setAiSuggestions(payload)
  setLoadingAiSuggestions(false)
          ↓
Render: SuggestionsList showing aiSuggestions
  - Display employee name + score
  - Display "Voir analyse" button
  - Display "Assigner" button
```

---

### Flow 2: Affichage du drawer détaillé

```
User clicks "Voir analyse" on Employee Y
          ↓
onClick handler (in suggestions list):
  setSelectedAiPosteEmployee(employee)  ← employee object already loaded
  setShowAiDetailsDrawer(true)
          ↓
Conditional render check:
  {showAiDetailsDrawer && selectedAiPosteEmployee && selectedPoste && (
    <PosteSuggestionsDrawer ... />
  )}
          ↓
PosteSuggestionsDrawer receives:
  props.employee = {
    full_name: "...",
    ai_score_details: {...},
    competence_matches: [...],
    historique_postes: [...],
    formations: [...]
  }
  props.poste = {
    poste: "...",
    raw_competences: [...]
  }
  props.onClose = () => { setShowAiDetailsDrawer(false) }
          ↓
Component renders:
  1. Header with employee name
  2. Poste info section
  3. Score d'adéquation bars
  4. Competence analysis list
  5. Historique postes scrollable
  6. Formations scrollable
```

---

### Flow 3: Assignation d'employé

```
User clicks "Assigner" button
          ↓
handleAssignEmployee(employeeId, employeeName)
  setAssigningEmployeeId(employeeId)
          ↓
API Call: POST /postes/{selectedPoste.id}/assign-employe
Payload: {employe_id: employeeId}
          ↓
Backend:
  1. Validate Poste exists
  2. Validate Employe exists
  3. Check no conflicts
  4. Create assignment
  5. Return success
          ↓
Frontend success handler:
  1. Swal.fire("Succès", "...", "success")
  2. fetchPostes() → Refresh positions list
  3. setAiSuggestions((prev) => 
       prev.filter(emp => emp.id !== employeeId)
     ) → Remove from suggestions
  4. fetchAiSuggestions(selectedPoste.id) → Refresh suggestions
          ↓
Frontend catch handler:
  - Swal.fire("Erreur", "Impossible d'assigner...", "error")
          ↓
Finally:
  setAssigningEmployeeId(null)  → Reset button state
```

---

## 3. DATA TRANSFORMATION MAPPING

### Mapping: API Response → PosteSuggestionsDrawer Props

```
API Response Employee Object
          ↓
PositionsGrades.fetchAiSuggestions()
  response.data.data[0] → aiSuggestions[0]
          ↓
User clicks "Voir analyse"
          ↓
PositionsGrades
  setSelectedAiPosteEmployee(aiSuggestions[0])
          ↓
PosteSuggestionsDrawer receives
  employee = {
    // From API response
    full_name: "Jean Dupont",
    nom: "Dupont",
    prenom: "Jean",
    score: 85,                          ← For display
    ai_score_details: {
      globalScore: 85,                  ← Main score bar
      competencesScore: 90,             ← Used for competences bar
      gradeScore: 85,                   ← Compatibility row
      tenureScore: 75                   ← Seniority row
    },
    competence_matches: [               ← For competences list
      {
        skill: "Python",
        required: true,
        match_status: "match",          ← Color coding
        niveau_requis: 3,               ← Displayed
        niveau_employe: 3               ← Displayed
      }
    ],
    historique_postes: [                ← For history section
      {
        poste_nom: "Dev Jr",
        grade_label: "Ingénieur",
        type_evolution: "Promotion",
        date_debut: "2021-01-15",
        date_fin: "2023-06-30",
        duree: "2 ans 6 mois",
        statut: "Validé"
      }
    ],
    formations: [                       ← For training section
      {
        intitule: "Python Avancé",
        organisme: "Coursera",
        date_debut: "2022-01-01",
        date_fin: "2022-06-01",
        duree: "6 mois",
        statut: "Terminé"
      }
    ]
  }
```

### Mapping: API Response Poste → PosteSuggestionsDrawer Props

```
API Response Poste Object
          ↓
PositionsGrades
  handleOpenSuggestionPanel(poste)
  setSelectedPoste(poste)
          ↓
PosteSuggestionsDrawer receives
  poste = {
    id: 1,                              ← Used for assignment API call
    poste: "Développeur Senior",        ← Displayed in header
    nom: "Développeur Senior",          ← Fallback for display
    grade: "Ingénieur",
    departement_id: 5,
    raw_competences: [                  ← For competences required list
      {
        id: 1,
        competence_id: 10,
        nom: "Python",
        label: "Python",
        name: "Python"
      }
    ]
  }
```

---

## 4. ERROR HANDLING

### API Errors & Recovery

```javascript
// fetchAiSuggestions error
catch (error) {
  console.error("AI_SUGGESTIONS_ERROR", error);
  setAiSuggestions([]);  // Reset to empty
}
// User sees: Empty suggestions list

// handleAssignEmployee error
catch (error) {
  console.error("ASSIGN_ERROR", error);
  Swal.fire("Erreur", "Impossible d'assigner l'employé.", "error");
}
// User sees: Error modal

// Common scenarios:
✓ 404 Poste not found
✓ 404 Employe not found
✓ 409 Conflict (employee already assigned)
✓ 500 Server error
✓ Network timeout
```

---

## 5. STATE LIFECYCLE

### In PositionsGrades.jsx

```javascript
// Initial state
const [showAiDetailsDrawer, setShowAiDetailsDrawer] = useState(false);
const [selectedAiPosteEmployee, setSelectedAiPosteEmployee] = useState(null);
const [selectedPoste, setSelectedPoste] = useState(null);
const [aiSuggestions, setAiSuggestions] = useState([]);
const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);

// Open panel:
setIsSuggestionOpen(true)
setDetailsPosteId(posteId)
setShowAiDetailsDrawer(false)  // Reset drawer
setSelectedAiPosteEmployee(null)

// Close all:
setIsSuggestionOpen(false)
setDetailsPosteId(null)
setShowAiDetailsDrawer(false)
setSelectedAiPosteEmployee(null)
setAiSuggestions([])
```

---

## 6. DEBUGGING CHECKLIST

When panel doesn't show correct data:

```
☐ Check network tab - API calls succeeding?
  ☐ GET /postes/{posteId}/suggestions - 200 OK?
  ☐ Response has data.data or data?

☐ Check component props in React DevTools
  ☐ PosteSuggestionsDrawer.employee populated?
  ☐ PosteSuggestionsDrawer.poste populated?
  ☐ showAiDetailsDrawer === true?

☐ Check state in PositionsGrades
  ☐ selectedAiPosteEmployee has data?
  ☐ selectedPoste has data?
  ☐ aiSuggestions is Array?

☐ Check console errors
  ☐ AI_SUGGESTIONS_ERROR logged?
  ☐ ASSIGN_ERROR logged?
  ☐ Missing data handling in component?

☐ Check performance
  ☐ loadingAiSuggestions still true?
  ☐ API call in progress?

☐ Verify API response structure
☐ Verify component receives props correctly
☐ Verify CSS classes loaded (.cnss-*)
```

---

## 7. Testing Scenarios

### Test 1: Basic Display Flow
```
1. ✓ Load page → positions displayed
2. ✓ Click "Voir suggestions" → suggestions loaded in 2-5 sec
3. ✓ Click "Voir analyse" → drawer appears with data
4. ✓ Click X button → drawer closes
```

### Test 2: Data Accuracy
```
1. ✓ Drawer shows correct employee name
2. ✓ Score matches what's in aiSuggestions
3. ✓ Competences list populated
4. ✓ Historique postes correctly formatted
5. ✓ Formations correctly formatted
```

### Test 3: Assignment Flow
```
1. ✓ Click "Assigner" → button shows "..."
2. ✓ Wait → API call successful
3. ✓ Notification appears "L'employé X a été assigné"
4. ✓ Employee removed from suggestions list
5. ✓ Suggestions refreshed (if any)
```

### Test 4: Error Handling
```
1. ✓ No poste ID → suggestions empty
2. ✓ API timeout → error in console
3. ✓ Invalid employee ID → error modal
4. ✓ Network error → error modal with message
```
