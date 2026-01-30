// Données fictives pour l'application Protection Sociale

export const employes = [
  { id: 1, matricule: "EMP001", nom: "BENALI", prenom: "Ahmed", cin: "AB123456", dateNaissance: "1985-03-15", dateEmbauche: "2018-01-10", poste: "Ingénieur", departement: "IT", salaire: 15000, statutCNSS: "Affilié", statutMutuelle: "Actif" },
  { id: 2, matricule: "EMP002", nom: "OUAZZANI", prenom: "Fatima", cin: "CD789012", dateNaissance: "1990-07-22", dateEmbauche: "2019-06-01", poste: "Comptable", departement: "Finance", salaire: 12000, statutCNSS: "Affilié", statutMutuelle: "Actif" },
  { id: 3, matricule: "EMP003", nom: "TAZI", prenom: "Mohamed", cin: "EF345678", dateNaissance: "1988-11-08", dateEmbauche: "2017-03-15", poste: "Manager", departement: "RH", salaire: 20000, statutCNSS: "Affilié", statutMutuelle: "Actif" },
  { id: 4, matricule: "EMP004", nom: "ALAOUI", prenom: "Khadija", cin: "GH901234", dateNaissance: "1992-05-30", dateEmbauche: "2020-09-01", poste: "Développeur", departement: "IT", salaire: 13000, statutCNSS: "En cours", statutMutuelle: "En attente" },
  { id: 5, matricule: "EMP005", nom: "FASSI", prenom: "Youssef", cin: "IJ567890", dateNaissance: "1987-12-18", dateEmbauche: "2016-04-20", poste: "Directeur", departement: "Direction", salaire: 35000, statutCNSS: "Affilié", statutMutuelle: "Actif" },
  { id: 6, matricule: "EMP006", nom: "BERRADA", prenom: "Salma", cin: "KL234567", dateNaissance: "1995-02-14", dateEmbauche: "2021-02-01", poste: "Assistante RH", departement: "RH", salaire: 8000, statutCNSS: "Affilié", statutMutuelle: "Actif" },
  { id: 7, matricule: "EMP007", nom: "CHRAIBI", prenom: "Omar", cin: "MN890123", dateNaissance: "1983-09-25", dateEmbauche: "2015-08-10", poste: "Chef de projet", departement: "IT", salaire: 22000, statutCNSS: "Affilié", statutMutuelle: "Actif" },
  { id: 8, matricule: "EMP008", nom: "BENNANI", prenom: "Laila", cin: "OP456789", dateNaissance: "1991-06-12", dateEmbauche: "2019-11-15", poste: "Analyste", departement: "Finance", salaire: 14000, statutCNSS: "Affilié", statutMutuelle: "Actif" },
];

export const dossiersCNSS = [
  { id: 1, employeId: 1, numeroCNSS: "1234567890", dateAffiliation: "2018-02-01", statut: "Actif", derniereMaj: "2025-12-15" },
  { id: 2, employeId: 2, numeroCNSS: "2345678901", dateAffiliation: "2019-07-01", statut: "Actif", derniereMaj: "2025-12-10" },
  { id: 3, employeId: 3, numeroCNSS: "3456789012", dateAffiliation: "2017-04-01", statut: "Actif", derniereMaj: "2025-12-12" },
  { id: 4, employeId: 4, numeroCNSS: null, dateAffiliation: null, statut: "En cours d'affiliation", derniereMaj: "2025-12-20" },
  { id: 5, employeId: 5, numeroCNSS: "4567890123", dateAffiliation: "2016-05-01", statut: "Actif", derniereMaj: "2025-12-08" },
  { id: 6, employeId: 6, numeroCNSS: "5678901234", dateAffiliation: "2021-03-01", statut: "Actif", derniereMaj: "2025-12-18" },
  { id: 7, employeId: 7, numeroCNSS: "6789012345", dateAffiliation: "2015-09-01", statut: "Actif", derniereMaj: "2025-12-05" },
  { id: 8, employeId: 8, numeroCNSS: "7890123456", dateAffiliation: "2019-12-01", statut: "Actif", derniereMaj: "2025-12-11" },
];

export const declarationsCNSS = [
  { id: 1, periode: "Décembre 2025", dateDeclaration: "2026-01-05", montantBrut: 139000, cotisationPatronale: 27800, cotisationSalariale: 6255, statut: "Validée", nbEmployes: 8 },
  { id: 2, periode: "Novembre 2025", dateDeclaration: "2025-12-05", montantBrut: 135000, cotisationPatronale: 27000, cotisationSalariale: 6075, statut: "Payée", nbEmployes: 8 },
  { id: 3, periode: "Octobre 2025", dateDeclaration: "2025-11-05", montantBrut: 132000, cotisationPatronale: 26400, cotisationSalariale: 5940, statut: "Payée", nbEmployes: 7 },
  { id: 4, periode: "Septembre 2025", dateDeclaration: "2025-10-05", montantBrut: 130000, cotisationPatronale: 26000, cotisationSalariale: 5850, statut: "Payée", nbEmployes: 7 },
  { id: 5, periode: "Août 2025", dateDeclaration: "2025-09-05", montantBrut: 128000, cotisationPatronale: 25600, cotisationSalariale: 5760, statut: "Payée", nbEmployes: 7 },
];

export const anomaliesCNSS = [
  { id: 1, type: "Matricule manquant", employe: "ALAOUI Khadija", description: "Numéro CNSS non renseigné", dateDetection: "2025-12-20", statut: "En attente", priorite: "Haute" },
  { id: 2, type: "Écart de salaire", employe: "BENNANI Laila", description: "Différence de 500 DH avec la paie", dateDetection: "2025-12-15", statut: "Résolu", priorite: "Moyenne" },
  { id: 3, type: "Date incorrecte", employe: "CHRAIBI Omar", description: "Date d'embauche incohérente", dateDetection: "2025-12-10", statut: "En cours", priorite: "Basse" },
];

export const paiementsCNSS = [
  { id: 1, reference: "PAY-2025-12", periode: "Décembre 2025", montant: 34055, dateEcheance: "2026-01-15", datePaiement: null, statut: "En attente", modePaiement: null },
  { id: 2, reference: "PAY-2025-11", periode: "Novembre 2025", montant: 33075, dateEcheance: "2025-12-15", datePaiement: "2025-12-14", statut: "Payé", modePaiement: "Virement" },
  { id: 3, reference: "PAY-2025-10", periode: "Octobre 2025", montant: 32340, dateEcheance: "2025-11-15", datePaiement: "2025-11-12", statut: "Payé", modePaiement: "Virement" },
  { id: 4, reference: "PAY-2025-09", periode: "Septembre 2025", montant: 31850, dateEcheance: "2025-10-15", datePaiement: "2025-10-15", statut: "Payé", modePaiement: "Virement" },
];

export const attestationsCNSS = [
  { id: 1, type: "Attestation d'affiliation", employe: "BENALI Ahmed", dateGeneration: "2025-12-20", statut: "Générée", fichier: "att_affiliation_benali.pdf" },
  { id: 2, type: "Attestation de salaire", employe: "OUAZZANI Fatima", dateGeneration: "2025-12-18", statut: "Générée", fichier: "att_salaire_ouazzani.pdf" },
  { id: 3, type: "Relevé de carrière", employe: "TAZI Mohamed", dateGeneration: "2025-12-15", statut: "En attente CNSS", fichier: null },
];

export const documentsCNSS = [
  { id: 1, nom: "Déclaration T4 - Décembre 2025", type: "Déclaration", dateUpload: "2026-01-05", taille: "245 Ko", categorie: "Déclarations" },
  { id: 2, nom: "Bordereau paiement Nov 2025", type: "Paiement", dateUpload: "2025-12-14", taille: "120 Ko", categorie: "Paiements" },
  { id: 3, nom: "Liste employés affiliés 2025", type: "Liste", dateUpload: "2025-12-01", taille: "89 Ko", categorie: "Affiliations" },
  { id: 4, nom: "Attestation CNSS - BENALI", type: "Attestation", dateUpload: "2025-12-20", taille: "56 Ko", categorie: "Attestations" },
];

// MUTUELLE
export const contratsMutuelle = [
  { id: 1, nom: "Régime Standard", code: "MUT-STD", tauxCouverture: 80, plafondAnnuel: 50000, cotisationMensuelle: 300, actif: true },
  { id: 2, nom: "Régime Premium", code: "MUT-PRM", tauxCouverture: 100, plafondAnnuel: 100000, cotisationMensuelle: 600, actif: true },
  { id: 3, nom: "Régime Famille", code: "MUT-FAM", tauxCouverture: 90, plafondAnnuel: 150000, cotisationMensuelle: 900, actif: true },
];

export const adhesionsMutuelle = [
  { id: 1, employeId: 1, contratId: 2, dateAdhesion: "2018-02-15", statut: "Actif", nbBeneficiaires: 3 },
  { id: 2, employeId: 2, contratId: 1, dateAdhesion: "2019-07-15", statut: "Actif", nbBeneficiaires: 2 },
  { id: 3, employeId: 3, contratId: 3, dateAdhesion: "2017-04-15", statut: "Actif", nbBeneficiaires: 4 },
  { id: 4, employeId: 5, contratId: 2, dateAdhesion: "2016-05-15", statut: "Actif", nbBeneficiaires: 2 },
  { id: 5, employeId: 6, contratId: 1, dateAdhesion: "2021-03-15", statut: "Actif", nbBeneficiaires: 1 },
  { id: 6, employeId: 7, contratId: 3, dateAdhesion: "2015-09-15", statut: "Actif", nbBeneficiaires: 5 },
  { id: 7, employeId: 8, contratId: 1, dateAdhesion: "2019-12-15", statut: "Actif", nbBeneficiaires: 1 },
];

export const ayantsDroit = [
  { id: 1, adhesionId: 1, nom: "BENALI", prenom: "Sara", lienParente: "Conjoint", dateNaissance: "1988-05-20", cin: "ZZ111222" },
  { id: 2, adhesionId: 1, nom: "BENALI", prenom: "Amine", lienParente: "Enfant", dateNaissance: "2015-08-10", cin: null },
  { id: 3, adhesionId: 1, nom: "BENALI", prenom: "Yasmine", lienParente: "Enfant", dateNaissance: "2018-02-25", cin: null },
  { id: 4, adhesionId: 2, nom: "OUAZZANI", prenom: "Hassan", lienParente: "Conjoint", dateNaissance: "1987-11-12", cin: "YY333444" },
  { id: 5, adhesionId: 3, nom: "TAZI", prenom: "Nadia", lienParente: "Conjoint", dateNaissance: "1990-03-08", cin: "XX555666" },
  { id: 6, adhesionId: 3, nom: "TAZI", prenom: "Imane", lienParente: "Enfant", dateNaissance: "2012-06-15", cin: null },
  { id: 7, adhesionId: 3, nom: "TAZI", prenom: "Rayan", lienParente: "Enfant", dateNaissance: "2016-09-22", cin: null },
];

export const demandesRemboursement = [
  { id: 1, reference: "RMB-2026-001", employeId: 1, dateDemande: "2026-01-10", typeSoin: "Consultation spécialiste", montant: 500, montantRembourse: 400, statut: "Validée", dateTraitement: "2026-01-15" },
  { id: 2, reference: "RMB-2026-002", employeId: 2, dateDemande: "2026-01-12", typeSoin: "Pharmacie", montant: 350, montantRembourse: null, statut: "En attente", dateTraitement: null },
  { id: 3, reference: "RMB-2026-003", employeId: 3, dateDemande: "2026-01-08", typeSoin: "Hospitalisation", montant: 8500, montantRembourse: 7650, statut: "Payée", dateTraitement: "2026-01-20" },
  { id: 4, reference: "RMB-2025-089", employeId: 5, dateDemande: "2025-12-20", typeSoin: "Dentaire", montant: 2000, montantRembourse: 1600, statut: "Payée", dateTraitement: "2025-12-28" },
  { id: 5, reference: "RMB-2025-090", employeId: 7, dateDemande: "2025-12-22", typeSoin: "Optique", montant: 1500, montantRembourse: 1350, statut: "Validée", dateTraitement: "2026-01-05" },
  { id: 6, reference: "RMB-2026-004", employeId: 6, dateDemande: "2026-01-18", typeSoin: "Analyses", montant: 800, montantRembourse: null, statut: "En cours", dateTraitement: null },
];

export const baremesMutuelle = [
  { id: 1, typeSoin: "Consultation généraliste", tauxRemboursement: 80, plafond: 200, franchise: 0 },
  { id: 2, typeSoin: "Consultation spécialiste", tauxRemboursement: 80, plafond: 500, franchise: 50 },
  { id: 3, typeSoin: "Pharmacie", tauxRemboursement: 80, plafond: 5000, franchise: 0 },
  { id: 4, typeSoin: "Hospitalisation", tauxRemboursement: 90, plafond: 50000, franchise: 500 },
  { id: 5, typeSoin: "Dentaire", tauxRemboursement: 80, plafond: 3000, franchise: 100 },
  { id: 6, typeSoin: "Optique", tauxRemboursement: 90, plafond: 2000, franchise: 0 },
  { id: 7, typeSoin: "Analyses", tauxRemboursement: 100, plafond: 2000, franchise: 0 },
  { id: 8, typeSoin: "Radiologie", tauxRemboursement: 90, plafond: 3000, franchise: 0 },
];

export const documentsMutuelle = [
  { id: 1, nom: "Carte mutuelle - BENALI Ahmed", type: "Carte", dateGeneration: "2025-12-01", statut: "Active" },
  { id: 2, nom: "Attestation adhésion - TAZI Mohamed", type: "Attestation", dateGeneration: "2025-11-15", statut: "Active" },
  { id: 3, nom: "Bordereau remboursements Déc 2025", type: "Bordereau", dateGeneration: "2026-01-02", statut: "Généré" },
];

// TRANSVERSALES
export const notifications = [
  { id: 1, titre: "Échéance paiement CNSS", message: "Le paiement CNSS de décembre 2025 est dû avant le 15/01/2026", type: "Alerte", dateCreation: "2026-01-10", lue: false },
  { id: 2, titre: "Nouvelle demande remboursement", message: "OUAZZANI Fatima a soumis une demande de remboursement", type: "Info", dateCreation: "2026-01-12", lue: false },
  { id: 3, titre: "Anomalie détectée", message: "Matricule CNSS manquant pour ALAOUI Khadija", type: "Erreur", dateCreation: "2025-12-20", lue: true },
  { id: 4, titre: "Déclaration CNSS validée", message: "La déclaration de décembre 2025 a été validée", type: "Succès", dateCreation: "2026-01-05", lue: true },
];

export const historiqueAudit = [
  { id: 1, action: "Création dossier CNSS", utilisateur: "admin@company.ma", dateAction: "2026-01-20 14:30", entite: "Dossier CNSS", details: "Création dossier pour ALAOUI Khadija" },
  { id: 2, action: "Validation déclaration", utilisateur: "rh@company.ma", dateAction: "2026-01-05 10:15", entite: "Déclaration CNSS", details: "Validation déclaration décembre 2025" },
  { id: 3, action: "Paiement effectué", utilisateur: "finance@company.ma", dateAction: "2025-12-14 16:45", entite: "Paiement CNSS", details: "Paiement cotisations novembre 2025" },
  { id: 4, action: "Demande remboursement", utilisateur: "employe@company.ma", dateAction: "2026-01-12 09:20", entite: "Remboursement", details: "Nouvelle demande pharmacie" },
  { id: 5, action: "Modification adhésion", utilisateur: "rh@company.ma", dateAction: "2026-01-08 11:30", entite: "Adhésion Mutuelle", details: "Ajout ayant droit pour BENALI Ahmed" },
];

// Statistiques Dashboard
export const statsCNSS = {
  totalEmployesAffities: 7,
  employesEnCours: 1,
  declarationsMois: 1,
  montantCotisations: 34055,
  anomaliesEnCours: 2,
};

export const statsMutuelle = {
  totalAdherents: 7,
  demandesEnCours: 2,
  montantRembourse: 11000,
  tauxUtilisation: 68,
};

export const statsGlobales = {
  totalEmployes: 8,
  couvertureCNSS: 87.5,
  couvertureMutuelle: 87.5,
  budgetProtectionSociale: 45000,
};
