# Carrières & Formations — Documentation Technique

> **Périmètre** : Ce document est généré à partir du code réel dans `ProjetFront` (React) et `GestionBE` (Laravel). Le dépôt utilise actuellement un backend Laravel (et non ASP.NET) avec des endpoints REST sous `/api`.

---

## 1) Logique Globale du Module

### Objectif
Le module **Carrières & Formations** couvre deux domaines RH distincts :

- **Carrières (Parcours professionnels)** : Visualiser et gérer l’évolution de carrière des employés, le poste/grade actuel et l’historique du parcours. Il expose également une vue Compétences liée aux employés et aux postes.
- **Formations** : Gérer le catalogue des formations, les détails des formations et le suivi des participants dans un workflow orienté interface utilisateur.

### Problèmes résolus
- Centraliser les données de carrière des employés (poste, grade, type d’évolution, période).
- Gérer les compétences des employés et les comparer aux exigences du poste.
- Présenter le catalogue de formations et la gestion des formations via une interface structurée.

### Fonctionnalités principales (telles qu’implémentées)

**Carrières**
- Panneau des départements avec filtrage à sélection unique.
- Tableau des carrières avec filtres/visibilité des colonnes, drawer d’ajout/modification et drawer “Voir parcours”.
- Drawer profil employé affichant les compétences + historique + détails du score IA (partagé avec le module Postes).

**Compétences (dans Carrières)**
- Tableau global du catalogue des compétences.
- “Niveau requis” affiché pour le poste actuel de l’employé sélectionné.
- “Niveau employé” affiché depuis la table pivot des compétences employé.
- Sliders inline pour définir les niveaux de compétence de l’employé.

**Formations**
- Tableau du catalogue des formations avec filtres, visibilité des colonnes, drawer ajout/modification/consultation.
- Détails de la formation et participants dans un drawer latéral droit.

### Flux utilisateur (Carrières)
1. L’utilisateur sélectionne un département dans le panneau gauche.
2. Le tableau Carrières filtre les employés par département.
3. L’utilisateur peut ajouter/modifier une carrière (drawer) ou ouvrir “Voir parcours”.
4. Dans l’onglet “Compétences”, sélectionner un employé charge :
   - les compétences de l’employé (niveaux)
   - les niveaux requis du poste

### Flux utilisateur (Formations)
1. L’utilisateur ouvre le catalogue des formations.
2. L’utilisateur peut ajouter/modifier/supprimer une formation.
3. “Voir détails” ouvre un drawer latéral droit avec onglets (Infos, Participants).

---

## 2) Base de Données & Relations entre Tables

> Tables listées à partir de `GestionBE/database/migrations` et des modèles Eloquent.

### Tables principales

**TABLE : `employes`**
- `id` (PK)
- `departement_id` (FK → `departements.id`, optionnel)
- `poste_id` (FK → `gp_postes.id`, nullable)  
- Plusieurs champs RH (matricule, nom, prenom, date_embauche, etc.)

Relations :
- **Employe → Poste** : `employes.poste_id` (Many-to-One)
- **Employe ↔ Departement** : pivot `employe_departement` (Many-to-Many)

**TABLE : `gp_postes`**
- `id` (PK)
- `nom`
- `unite_id` (FK → `unites.id`)
- `grade_id` (FK → `gp_grades.id`)
- `statut`, `niveau`, `description`, `is_active`, `code` (nullable)

Relations :
- **Poste → Grade** : `gp_postes.grade_id` (Many-to-One)
- **Poste → Unite** : `gp_postes.unite_id` (Many-to-One)
- **Poste ↔ Competence** : `gp_poste_competence` (Many-to-Many)
- **Poste → Employe** : `employes.poste_id` (One-to-Many)

**TABLE : `gp_grades`**
- `id` (PK)
- `code` (unique)
- `label`
- `description` (nullable)

Relations :
- **Grade → Postes** : One-to-Many

**TABLE : `gp_competences`**
- `id` (PK)
- `nom`, `categorie`, `description`

Relations :
- **Competence ↔ Poste** : Many-to-Many (`gp_poste_competence`)
- **Competence ↔ Employe** : Many-to-Many (`gp_employe_competence`)

---

### Tables pivot / liaison

**TABLE : `gp_poste_competence`**
- `id` (PK)
- `poste_id` (FK → `gp_postes.id`)
- `competence_id` (FK → `gp_competences.id`)
- `niveau_requis` (tinyint, nullable, default 0)
- `is_required` (boolean)

Signification :
- Définit le *niveau requis* de chaque compétence pour un poste donné.

**TABLE : `gp_employe_competence`**
- `id` (PK)
- `employe_id` (FK → `employes.id`)
- `competence_id` (FK → `gp_competences.id`)
- `niveau` (int 0–5) **(ajouté ultérieurement)**
- `niveau_acquis` (champ legacy)
- `date_acquisition`

Signification :
- Stocke le *niveau de compétence de l’employé*.

**TABLE : `gp_employe_poste_historiques`**
- `id` (PK)
- `employe_id` (FK → `employes.id`)
- `poste_id` (FK → `gp_postes.id`, nullable)
- `grade_id` (FK → `gp_grades.id`, nullable)
- `date_debut`, `date_fin`
- `type_evolution` (Promotion, Mutation, Affectation, …)

Signification :
- Stocke l’historique de carrière d’un employé.

---

## 3) Logique Frontend (React)

### Pattern d’accès aux données
- **Fetch manuel avec Axios** (`apiClient`) et `useEffect`.
- Pas de React Query dans les modules actuels.
- Hiérarchie des départements chargée via URL directe : `http://127.0.0.1:8000/api/departements/hierarchy`.

### Flux UI Carrières
1. Charger le catalogue global des compétences : `GET /api/competences`.
2. Charger la liste des employés : `GET /api/employes`.
3. Lorsqu’un employé est sélectionné :
   - `GET /api/employes/{id}/competences`
   - Résolution du `poste_id` → `GET /api/postes/{posteId}/competences`
4. Affichage :
   - **Niveau requis** depuis `gp_poste_competence.niveau_requis`.
   - **Niveau employé** depuis `gp_employe_competence.niveau`.
5. Mise à jour via sliders :
   - POST, PUT, DELETE sur `/api/employes/{id}/competences`.

---

## 4) Logique Postes & Grades

### Module Postes
Un **Poste** représente un rôle/fonction dans l’organisation.

Endpoints backend :
- `GET /api/postes`
- `GET /api/postes/{id}`
- `POST /api/postes`
- `PUT /api/postes/{id}`
- `DELETE /api/postes/{id}`
- `GET /api/postes/{id}/competences`
- `PUT /api/postes/{id}/competences`
- `GET /api/postes/{id}/suggestions`
- `POST /api/postes/{id}/assign-employe`

Les compétences du poste sont stockées dans `gp_poste_competence` avec `niveau_requis`.

---

### Module Grades
Un **Grade** représente un niveau/séniorité utilisé par les Postes.

Relations :
- `gp_postes.grade_id`
- `gp_employe_poste_historiques.grade_id`

---

## 5) Fonctionnement Global

### Workflow métier
1. RH définit des **Postes** avec compétences requises.
2. Les employés ont leurs propres niveaux de compétences.
3. Le système compare les niveaux.
4. RH consulte l’historique via Carrières.

### Workflow données
- Poste ↔ Competence → exigences
- Employe ↔ Competence → compétences réelles
- Historique stocké dans `gp_employe_poste_historiques`

---

## 6) Suggestions d’Amélioration

- Carrières utilise localStorage → prévoir endpoint backend.
- Formations est mock-only.
- Uniformiser les appels API.
- Migrer vers React Query.
- Centraliser le chargement des départements.

---

## Référence Endpoints

- `/api/postes`
- `/api/grades`
- `/api/competences`
- `/api/employes/{id}/competences`
- `/api/departements/hierarchy`