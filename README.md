# rh-sps-stage


# Prompt pour réaliser les diagrammes UML — Module Gestion Mutuelle 

---

## Contexte

Réalise les diagrammes UML suivants pour une application web RH (Laravel + React) composée de deux modules principaux : **Gestion Mutuelle** et **Gestion des Carrières & Formations**. Il y a un seul acteur : **RH** (Responsable Ressources Humaines).

Génère le contenu en **Mermaid** (compatible markdown/README.md).

---

## 1. Diagramme de cas d'utilisation (Use Case)

```
Acteur unique : RH

Module Gestion Mutuelle :
- Gérer les affiliations mutuelle
  - Consulter l'affiliation d'un employé
  - Modifier le numéro d'affiliation
  - Modifier le statut d'affiliation (Actif, Inactif, En attente)
  - Ajouter un bénéficiaire (ayant droit)
  - Modifier un bénéficiaire
  - Supprimer un bénéficiaire
- Gérer les déclarations mutuelle
  - Consulter les déclarations
  - Créer une nouvelle déclaration (période, type, employés concernés)
  - Modifier une déclaration
  - Supprimer une déclaration
  - Valider une déclaration
  - Télécharger une déclaration PDF
- Gérer les opérations mutuelle
  - Consulter les opérations d'un employé
  - Créer une nouvelle opération (paiement, remboursement, régularisation)
  - Modifier une opération
  - Supprimer une opération
  - Joindre des documents justificatifs
  - Gérer les types d'opération (ajouter, modifier, supprimer)
- Consulter le tableau de bord mutuelle

Module Gestion des Carrières & Formations :
- Gérer les carrières
  - Consulter le parcours d'un employé
  - Ajouter une carrière (poste, grade, type d'évolution)
  - Modifier une carrière
  - Supprimer une carrière
  - Voir le parcours et historique
  - Gérer les types d'évolution (ajouter, modifier, supprimer)
- Gérer les compétences
  - Consulter les compétences d'un employé
  - Ajouter une compétence à un employé (avec niveau)
  - Modifier le niveau d'une compétence
  - Supprimer une compétence d'un employé
- Gérer les formations
  - Consulter le catalogue de formations
  - Créer une formation (code, titre, domaine, type, durée, budget, formateur)
  - Modifier une formation
  - Supprimer une formation
  - Affecter un formateur interne (employé) ou externe
  - Gérer les formateurs externes (ajouter, modifier, supprimer)
- Gérer les participants aux formations
  - Consulter les participants d'une formation
  - Ajouter un ou plusieurs participants (employés)
  - Supprimer un participant
  - Modifier le statut/note/commentaire d'un participant
- Gérer les postes et grades
  - Consulter les postes
  - Créer un poste
  - Modifier un poste
  - Supprimer un poste
  - Consulter les grades
  - Créer un grade
  - Modifier un grade
  - Supprimer un grade
- Consulter le tableau de bord carrières
- Consulter le tableau de bord formations

Relations include/extend :
- "Créer une opération" <<include>> "Sélectionner un type d'opération"
- "Créer une opération" <<extend>> "Gérer les types d'opération"
- "Créer une opération" <<extend>> "Joindre des documents"
- "Créer une formation" <<include>> "Affecter un formateur"
- "Affecter un formateur" <<extend>> "Gérer les formateurs externes"
- "Ajouter une carrière" <<include>> "Sélectionner un type d'évolution"
- "Ajouter une carrière" <<extend>> "Gérer les types d'évolution"
- "Modifier le poste d'un employé" <<include>> "Créer un historique de carrière"
```

Génère le diagramme Mermaid Use Case correspondant.

---

## 2. Diagramme de classes

```
Classes et attributs :

Employe {
  id: int <<PK>>
  matricule: string
  nom: string
  prenom: string
  sexe: string
  date_naissance: date
  lieu_naissance: string
  cin: string
  cnss: string
  situation_familiale: string
  nombre_enfants: int
  adresse: string
  ville: string
  pays: string
  code_postal: string
  date_entree: date
  date_embauche: date
  date_sortie: date
  salaire_base: decimal
  remarque: text
  url_img: string
  centre_cout: string
  num_badge: string
  departement_id: int <<FK>>
  poste_id: int <<FK>>
  active: boolean
}

Departement {
  id: int <<PK>>
  nom: string
  parent_id: int <<FK>> (auto-référence)
}

GpPoste {
  id: int <<PK>>
  nom: string
  unite_id: int <<FK>>
}

GpGrade {
  id: int <<PK>>
  code: string
  nom: string
  description: text
  niveau: int
  categorie: string
}

GpEmployePosteHistorique {
  id: int <<PK>>
  employe_id: int <<FK>>
  poste_id: int <<FK>>
  grade_id: int <<FK>>
  type_evolution_id: int <<FK>>
  date_debut: date
  date_fin: date
  derniere_promotion: date
  motif: string
  commentaire: text
}

TypeEvolution {
  id: int <<PK>>
  name: string
}

EmployeCompetence {
  id: int <<PK>>
  employe_id: int <<FK>>
  competence_id: int <<FK>>
  niveau_acquis: int
}

Competence {
  id: int <<PK>>
  name: string
  categorie: string
  description: text
}

Formation {
  id: int <<PK>>
  code: string
  titre: string
  domaine: string
  type: string (Interne/Externe)
  duree: string
  statut: string (Planifie/En cours/Termine/Annule)
  date_debut: date
  date_fin: date
  budget: decimal
  organisme: string
  formateur_employe_id: int <<FK>> (nullable, si Interne)
  formateur_id: int <<FK>> (nullable, si Externe)
}

FormationParticipant {
  id: int <<PK>>
  formation_id: int <<FK>>
  employe_id: int <<FK>>
  statut: string (En attente/En cours/Termine/Annule)
  note: string
  commentaire: text
  attestation: string
}

Formateur {
  id: int <<PK>>
  name: string
}

AffiliationMutuelle {
  id: int <<PK>>
  employe_id: int <<FK>>
  numero_affiliation: string
  statut: string (Actif/Inactif/En attente)
  date_affiliation: date
}

Beneficiaire {
  id: int <<PK>>
  affiliation_id: int <<FK>>
  nom: string
  prenom: string
  lien_parente: string
  date_naissance: date
  numero_mutuelle: string
}

DeclarationMutuelle {
  id: int <<PK>>
  reference: string
  periode: string
  type: string (Mensuelle/Trimestrielle/Annuelle)
  statut: string (Brouillon/Validee/Envoyee/Rejetee)
  nombre_employes: int
  montant_total: decimal
  date_creation: date
  commentaire: text
}

OperationMutuelle {
  id: int <<PK>>
  employe_id: int <<FK>>
  date_operation: date
  type_operation_id: int <<FK>>
  statut: string (En attente/Validee/Rejetee/En cours)
  beneficiaire: string
  montant_total: decimal
  montant_rembourse: decimal
  reste: decimal
  commentaire: text
}

TypeOperation {
  id: int <<PK>>
  name: string
}

DocumentOperation {
  id: int <<PK>>
  operation_id: int <<FK>>
  nom_fichier: string
  chemin: string
  type_mime: string
}

Contrat {
  id: int <<PK>>
  employe_id: int <<FK>>
  contract_type_id: int <<FK>>
  date_debut: date
  date_fin: date
  statut: string
}

ContractType {
  id: int <<PK>>
  name: string
}

Relations :
- Departement "1" -- "*" Employe
- Departement "0..1" -- "*" Departement (parent_id, auto-référence)
- GpPoste "1" -- "*" Employe
- Employe "1" -- "*" GpEmployePosteHistorique
- GpPoste "1" -- "*" GpEmployePosteHistorique
- GpGrade "1" -- "*" GpEmployePosteHistorique
- TypeEvolution "1" -- "*" GpEmployePosteHistorique
- Employe "1" -- "*" EmployeCompetence
- Competence "1" -- "*" EmployeCompetence
- Formation "1" -- "*" FormationParticipant
- Employe "1" -- "*" FormationParticipant
- Employe "0..1" -- "*" Formation (formateur_employe_id, formateur interne)
- Formateur "0..1" -- "*" Formation (formateur_id, formateur externe)
- Employe "1" -- "0..1" AffiliationMutuelle
- AffiliationMutuelle "1" -- "*" Beneficiaire
- Employe "1" -- "*" OperationMutuelle
- TypeOperation "1" -- "*" OperationMutuelle
- OperationMutuelle "1" -- "*" DocumentOperation
- DeclarationMutuelle "*" -- "*" Employe
- Employe "1" -- "*" Contrat
- ContractType "1" -- "*" Contrat
```

Génère le diagramme de classes Mermaid correspondant.

---

## 3. Diagrammes de séquence

### 3.1 Séquence — Affilier un employé à la mutuelle

```
Acteurs/Objets : RH, Interface (React), API (Laravel), Base de données

1. RH -> Interface : Sélectionner un département
2. Interface -> API : GET /api/departements
3. API -> Base de données : SELECT * FROM departements
4. Base de données -> API : Liste des départements
5. API -> Interface : JSON départements
6. Interface -> RH : Afficher arborescence départements

7. RH -> Interface : Sélectionner un département spécifique
8. Interface -> API : GET /api/employes?departement_id={id}
9. API -> Base de données : SELECT * FROM employes WHERE departement_id = {id}
10. Base de données -> API : Liste des employés
11. API -> Interface : JSON employés
12. Interface -> RH : Afficher liste des employés

13. RH -> Interface : Cliquer sur un employé
14. Interface -> API : GET /api/affiliations/{employe_id}
15. API -> Base de données : SELECT * FROM affiliations WHERE employe_id = {id}
16. Base de données -> API : Données affiliation + bénéficiaires
17. API -> Interface : JSON affiliation
18. Interface -> RH : Afficher formulaire affiliation pré-rempli

19. RH -> Interface : Modifier numéro affiliation + ajouter bénéficiaire
20. RH -> Interface : Cliquer "Sauvegarder"
21. Interface -> API : PUT /api/affiliations/{id} (données affiliation + bénéficiaires)
22. API -> Base de données : UPDATE affiliations SET ... WHERE id = {id}
23. API -> Base de données : INSERT INTO beneficiaires (...)
24. Base de données -> API : OK
25. API -> Interface : 200 OK + JSON affiliation mise à jour
26. Interface -> RH : Afficher message succès "Affiliation sauvegardée"
```

### 3.2 Séquence — Créer une opération mutuelle

```
Acteurs/Objets : RH, Interface (React), API (Laravel), Base de données

1. RH -> Interface : Sélectionner un département
2. Interface -> API : GET /api/departements
3. API -> Interface : JSON départements
4. RH -> Interface : Sélectionner un employé
5. Interface -> API : GET /api/employes?departement_id={id}
6. API -> Interface : JSON employés

7. RH -> Interface : Cliquer "Nouvelle opération"
8. Interface -> API : GET /api/cnss-operations/types
9. API -> Base de données : SELECT * FROM cnss_operations (types)
10. API -> Interface : JSON types d'opération
11. Interface -> RH : Afficher formulaire avec dropdown types

12. RH -> Interface : Sélectionner type "Remboursement"
13. Interface -> RH : Afficher champs montants (total, remboursé)

14. RH -> Interface : Remplir les champs (date, montant total, montant remboursé, bénéficiaire, commentaire)
15. Interface : Calculer automatiquement reste = total - remboursé

16. RH -> Interface : Joindre des documents (upload fichiers)
17. Interface : Stocker fichiers en attente

18. RH -> Interface : Cliquer "Enregistrer"
19. Interface -> API : POST /api/dossiers (FormData : données + fichiers)
20. API -> Base de données : INSERT INTO operations_mutuelle (...)
21. API -> Base de données : INSERT INTO documents_operation (...) pour chaque fichier
22. API : Stocker fichiers sur le serveur (storage)
23. Base de données -> API : OK
24. API -> Interface : 201 Created + JSON opération créée
25. Interface -> RH : Fermer formulaire + afficher message succès + rafraîchir tableau
```

### 3.3 Séquence — Gérer les types d'opération

```
Acteurs/Objets : RH, Interface (React), Modal (React), API (Laravel), Base de données

1. RH -> Interface : Cliquer sur "+" à côté du dropdown Type d'opération
2. Interface -> Modal : Ouvrir modal "Gérer les types d'opération"
3. Modal -> API : GET /api/cnss-operations/types
4. API -> Base de données : SELECT * FROM cnss_operations
5. API -> Modal : JSON types existants
6. Modal -> RH : Afficher liste des types avec actions (modifier, supprimer)

--- Ajouter un type ---
7. RH -> Modal : Saisir nom du nouveau type + cliquer "Ajouter"
8. Modal -> API : POST /api/cnss-operations/types {name: "Nouveau type"}
9. API -> Base de données : INSERT INTO cnss_operations (name) VALUES (...)
10. Base de données -> API : OK
11. API -> Modal : 201 Created + JSON nouveau type
12. Modal -> RH : Rafraîchir liste + message succès

--- Modifier un type ---
13. RH -> Modal : Cliquer icône crayon sur un type
14. Modal -> RH : Champ éditable avec le nom actuel
15. RH -> Modal : Modifier le nom + confirmer
16. Modal -> API : PUT /api/cnss-operations/types/{id} {name: "Nom modifié"}
17. API -> Base de données : UPDATE cnss_operations SET name = ... WHERE id = {id}
18. API -> Modal : 200 OK
19. Modal -> RH : Rafraîchir liste

--- Supprimer un type ---
20. RH -> Modal : Cliquer icône poubelle sur un type
21. Modal -> RH : Afficher confirmation "Êtes-vous sûr ?"
22. RH -> Modal : Confirmer suppression
23. Modal -> API : DELETE /api/cnss-operations/types/{id}
24. API -> Base de données : DELETE FROM cnss_operations WHERE id = {id}
25. API -> Modal : 200 OK
26. Modal -> RH : Rafraîchir liste

27. RH -> Modal : Fermer le modal
28. Modal -> Interface : Mettre à jour le dropdown des types
```

### 3.4 Séquence — Ajouter une carrière à un employé

```
Acteurs/Objets : RH, Interface (React), API (Laravel), Base de données

1. RH -> Interface : Sélectionner un département dans l'arborescence
2. Interface -> API : GET /api/employes/list-for-select?departement_id={id}
3. API -> Interface : JSON employés (id, matricule, nom, prenom, date_embauche)
4. Interface -> RH : Afficher liste des employés

5. RH -> Interface : Sélectionner un employé
6. Interface -> API : GET /api/carrieres?departement_id={id}
7. API -> Base de données : SELECT historiques + postes + grades + types_evolution
8. API -> Interface : JSON carrières de l'employé
9. Interface -> RH : Afficher tableau des carrières

10. RH -> Interface : Cliquer "Ajouter une carrière"
11. Interface -> API : GET /api/postes (liste des postes)
12. Interface -> API : GET /api/grades (liste des grades)
13. Interface -> API : GET /api/types-evolution (liste des types d'évolution)
14. API -> Interface : JSON postes + grades + types
15. Interface -> RH : Afficher formulaire pré-rempli (matricule, nom employé)
16. Interface : Calculer période automatiquement (date_embauche → aujourd'hui)
17. Interface -> RH : Afficher période calculée (ex: "3 ans 2 mois")

18. RH -> Interface : Sélectionner poste, grade, type d'évolution, date dernière promotion
19. RH -> Interface : Cliquer "Enregistrer"
20. Interface -> API : POST /api/carrieres {employe_id, poste_id, grade_id, type_evolution_id, derniere_promotion}
21. API -> Base de données : Fermer historique actif (SET date_fin = today)
22. API -> Base de données : INSERT INTO gp_employe_poste_historiques (...)
23. API -> Base de données : UPDATE employes SET poste_id = {nouveau_poste_id}
24. Base de données -> API : OK
25. API -> Interface : 201 Created + JSON carrière créée
26. Interface -> RH : Fermer formulaire + rafraîchir tableau + message succès
```

### 3.5 Séquence — Gérer les formations et participants

```
Acteurs/Objets : RH, Interface (React), API (Laravel), Base de données

--- Créer une formation ---
1. RH -> Interface : Cliquer "Ajouter une formation"
2. Interface -> RH : Afficher formulaire (code, titre, domaine, type, durée, statut, dates, budget)

3. RH -> Interface : Sélectionner type = "Interne"
4. Interface -> API : GET /api/employes/list-for-select
5. API -> Interface : JSON liste employés
6. Interface -> RH : Afficher dropdown "Formateur (employé)"
7. RH -> Interface : Sélectionner un employé comme formateur

   --- OU ---
   
3b. RH -> Interface : Sélectionner type = "Externe"
4b. Interface -> API : GET /api/formateurs
5b. API -> Interface : JSON liste formateurs externes
6b. Interface -> RH : Afficher dropdown "Formateur externe" + bouton "+"
7b. RH -> Interface : Sélectionner un formateur externe (ou en créer un via le bouton "+")

8. RH -> Interface : Remplir tous les champs + cliquer "Enregistrer"
9. Interface -> API : POST /api/formations {code, titre, domaine, type, ..., formateur_employe_id ou formateur_id}
10. API -> Base de données : INSERT INTO formations (...)
11. API -> Interface : 201 Created + JSON formation
12. Interface -> RH : Fermer formulaire + rafraîchir tableau + message succès

--- Ajouter des participants ---
13. RH -> Interface : Naviguer vers "Formation Participants"
14. Interface -> API : GET /api/formations
15. API -> Interface : JSON formations avec count participants
16. Interface -> RH : Afficher tableau des formations

17. RH -> Interface : Cliquer sur une formation (sélection)
18. Interface -> RH : Activer bouton "Ajouter Participants"

19. RH -> Interface : Cliquer "Ajouter Participants"
20. Interface -> API : GET /api/employes/list-for-select
21. Interface -> API : GET /api/formations/{id}/participants
22. API -> Interface : JSON employés + participants existants
23. Interface : Filtrer employés (exclure ceux déjà participants)
24. Interface -> RH : Afficher panneau avec Select multi-employés

25. RH -> Interface : Sélectionner plusieurs employés
26. RH -> Interface : Cliquer "Ajouter (N)"
27. Interface -> API : POST /api/formations/{id}/participants {employe_ids: [1, 5, 12]}
28. API -> Base de données : INSERT INTO formation_participants (...) pour chaque employé
29. API -> Interface : 201 Created
30. Interface -> RH : Fermer panneau + rafraîchir compteur + message succès
```

### 3.6 Séquence — Créer une déclaration mutuelle

```
Acteurs/Objets : RH, Interface (React), API (Laravel), Base de données

1. RH -> Interface : Cliquer "Nouvelle déclaration"
2. Interface -> RH : Afficher formulaire (période, type, département, employés)

3. RH -> Interface : Sélectionner période (mois/année) et type (Mensuelle)
4. RH -> Interface : Sélectionner département
5. Interface -> API : GET /api/employes?departement_id={id}
6. API -> Interface : JSON employés du département
7. Interface -> RH : Afficher liste employés avec cases à cocher

8. RH -> Interface : Cocher les employés à inclure
9. Interface : Calculer montant total = Σ salaires des employés sélectionnés
10. Interface -> RH : Afficher montant total calculé

11. RH -> Interface : Ajouter commentaire + cliquer "Enregistrer"
12. Interface -> API : POST /api/declarations {periode, type, departement_id, employe_ids, montant_total, commentaire}
13. API -> Base de données : INSERT INTO declarations_mutuelle (...)
14. API -> Base de données : INSERT INTO declaration_employe (...) pour chaque employé
15. API : Générer référence unique automatiquement
16. Base de données -> API : OK
17. API -> Interface : 201 Created + JSON déclaration (statut = "Brouillon")
18. Interface -> RH : Fermer formulaire + rafraîchir tableau + message succès

--- Valider la déclaration ---
19. RH -> Interface : Cliquer icône "Valider" sur la déclaration
20. Interface -> API : PUT /api/declarations/{id} {statut: "Validee"}
21. API -> Base de données : UPDATE declarations SET statut = "Validee"
22. API -> Interface : 200 OK
23. Interface -> RH : Mettre à jour badge statut dans le tableau
```

---

## Instructions pour le rendu

Génère un fichier **README.md** contenant :
1. **Diagramme de cas d'utilisation** en Mermaid (un seul acteur RH, deux packages : Gestion Mutuelle et Gestion Carrières & Formations)
2. **Diagramme de classes** en Mermaid avec toutes les classes, attributs, et relations listées ci-dessus
3. **6 diagrammes de séquence** en Mermaid correspondant aux 6 flux décrits ci-dessus

Utilise la syntaxe Mermaid compatible GitHub markdown. Chaque diagramme doit être dans un bloc \`\`\`mermaid.