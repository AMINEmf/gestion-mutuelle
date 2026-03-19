# Postes & Grades API

## Tables
- `gp_postes` (existante)
  - Ajouts: `grade_id`, `statut`, `niveau`, `description`, `is_active`, `code`
- `gp_grades`
  - `id`, `code`, `label`, `description`, timestamps
- `gp_competences`
  - `id`, `nom`, `categorie`, `description`, timestamps
- `gp_poste_competence`
  - `id`, `poste_id`, `competence_id`, `niveau_requis`, `is_required`, timestamps

## Endpoints
- `GET /api/postes`
  - Query params: `search`, `unite_id`, `grade_id`, `statut`, `per_page`
  - Retour: liste (ou pagination si `per_page` > 0), avec `grade` et `competences_count`.
- `GET /api/postes/{id}`
  - Retour: poste + `grade` + `competences`.
- `POST /api/postes`
  - Body: `nom`, `unite_id`, `grade_id?`, `statut?`, `niveau?`, `description?`, `is_active?`, `code?`
- `PUT /api/postes/{id}`
  - Body: memes champs, en `sometimes` pour update partiel.
- `DELETE /api/postes/{id}`

- `PUT /api/postes/{poste}/competences`
  - Body:
    - `competence_ids`: `[1, 2, 3]`
    - `pivots`: `{ "1": { "niveau_requis": 3, "is_required": true } }`

- `GET /api/grades`
- `GET /api/grades/{id}`
- `POST /api/grades`
- `PUT /api/grades/{id}`
- `DELETE /api/grades/{id}`

- `GET /api/competences`
- `GET /api/competences/{id}`
- `POST /api/competences`
- `PUT /api/competences/{id}`
- `DELETE /api/competences/{id}`

## Seeders
- `GpGradesSeeder` (G1..G5)
- `GpCompetencesSeeder` (12-20 competences par categorie)
- `GpPostesSeeder` (optionnel, cree 6 postes si table vide)
- `GpPosteCompetenceSeeder` (assigne grades + competences)

## Seeding
Commandes:
```bash
php GestionBE/artisan db:seed --class=GpGradesSeeder
php GestionBE/artisan db:seed --class=GpCompetencesSeeder
php GestionBE/artisan db:seed --class=GpPostesSeeder
php GestionBE/artisan db:seed --class=GpPosteCompetenceSeeder
```

Notes:
- `GpPostesSeeder` ne touche pas aux postes existants.
- `GpPosteCompetenceSeeder` complete `grade_id/statut/niveau/description` si manquant.

## Exemple payload
```json
{
  "nom": "Developpeur Senior",
  "unite_id": 1,
  "grade_id": 4,
  "statut": "actif",
  "niveau": "Senior",
  "description": "Poste front/back",
  "is_active": true,
  "code": "DEV-SENIOR"
}
```
