export const USE_MOCK_DATA = true;

export const careerEmployees = [
  {
    id: 1,
    matricule: "EMP-001",
    full_name: "Ahmed El Amrani",
    departement: "Informatique",
    poste_actuel: "Developpeur Senior",
    grade: "G4",
    derniere_promotion: "2025-09-10",
    promotions: [
      { date: "2022-06-15", poste: "Developpeur", grade: "G2" },
      { date: "2024-01-20", poste: "Developpeur Confirme", grade: "G3" },
      { date: "2025-09-10", poste: "Developpeur Senior", grade: "G4" }
    ],
    competences: [
      { nom: "React", niveau: 4 },
      { nom: "Node.js", niveau: 3 },
      { nom: "Architecture", niveau: 3 }
    ],
    formations: [
      { titre: "React Avance", annee: "2024" },
      { titre: "Leadership Technique", annee: "2025" }
    ]
  },
  {
    id: 2,
    matricule: "EMP-002",
    full_name: "Sara Benali",
    departement: "Finance",
    poste_actuel: "Controleur",
    grade: "G3",
    derniere_promotion: "2024-11-04",
    promotions: [
      { date: "2021-03-02", poste: "Analyste", grade: "G1" },
      { date: "2023-05-18", poste: "Analyste Senior", grade: "G2" },
      { date: "2024-11-04", poste: "Controleur", grade: "G3" }
    ],
    competences: [
      { nom: "Reporting", niveau: 4 },
      { nom: "Excel", niveau: 5 },
      { nom: "Budget", niveau: 3 }
    ],
    formations: [
      { titre: "Controle de gestion", annee: "2023" },
      { titre: "Budget & Prevision", annee: "2024" }
    ]
  },
  {
    id: 3,
    matricule: "EMP-003",
    full_name: "Youssef Karim",
    departement: "RH",
    poste_actuel: "HR Business Partner",
    grade: "G4",
    derniere_promotion: "2025-05-27",
    promotions: [
      { date: "2020-10-12", poste: "Charge RH", grade: "G2" },
      { date: "2022-04-11", poste: "Responsable RH", grade: "G3" },
      { date: "2025-05-27", poste: "HR Business Partner", grade: "G4" }
    ],
    competences: [
      { nom: "Talent", niveau: 4 },
      { nom: "Communication", niveau: 4 },
      { nom: "Negociation", niveau: 3 }
    ],
    formations: [
      { titre: "People Analytics", annee: "2024" },
      { titre: "Strategie RH", annee: "2025" }
    ]
  },
  {
    id: 4,
    matricule: "EMP-004",
    full_name: "Lina Omari",
    departement: "Marketing",
    poste_actuel: "Chef de produit",
    grade: "G3",
    derniere_promotion: "2024-06-02",
    promotions: [
      { date: "2021-09-01", poste: "Chargee Marketing", grade: "G1" },
      { date: "2023-02-17", poste: "Product Owner", grade: "G2" },
      { date: "2024-06-02", poste: "Chef de produit", grade: "G3" }
    ],
    competences: [
      { nom: "Strategie", niveau: 4 },
      { nom: "Go-To-Market", niveau: 3 },
      { nom: "Data", niveau: 3 }
    ],
    formations: [
      { titre: "Marketing Digital", annee: "2023" },
      { titre: "Product Strategy", annee: "2024" }
    ]
  },
  {
    id: 5,
    matricule: "EMP-005",
    full_name: "Hassan Tazi",
    departement: "Production",
    poste_actuel: "Superviseur",
    grade: "G2",
    derniere_promotion: "2023-12-13",
    promotions: [
      { date: "2019-03-22", poste: "Operateur", grade: "G1" },
      { date: "2023-12-13", poste: "Superviseur", grade: "G2" }
    ],
    competences: [
      { nom: "Lean", niveau: 3 },
      { nom: "Qualite", niveau: 3 },
      { nom: "Securite", niveau: 4 }
    ],
    formations: [
      { titre: "Lean Manufacturing", annee: "2022" },
      { titre: "HSE Niveau 2", annee: "2023" }
    ]
  }
];

export const positions = [
  {
    id: 101,
    poste: "Developpeur Senior",
    departement: "Informatique",
    grade: "G4",
    statut: "Actif",
    niveau: "Senior",
    competences: ["React", "Node.js", "Architecture"]
  },
  {
    id: 102,
    poste: "Controleur",
    departement: "Finance",
    grade: "G3",
    statut: "Actif",
    niveau: "Confirme",
    competences: ["Reporting", "Budget", "Excel"]
  },
  {
    id: 103,
    poste: "HR Business Partner",
    departement: "RH",
    grade: "G4",
    statut: "Actif",
    niveau: "Senior",
    competences: ["Talent", "Communication", "Negociation"]
  }
];

export const grades = [
  { id: "G1", label: "G1 - Junior", description: "Debutant / Apprenant" },
  { id: "G2", label: "G2 - Intermediaire", description: "Autonome" },
  { id: "G3", label: "G3 - Confirme", description: "Expertise metier" },
  { id: "G4", label: "G4 - Senior", description: "Leadership technique" },
  { id: "G5", label: "G5 - Manager", description: "Pilotage et strategie" }
];

export const competences = [
  { id: 201, nom: "React", categorie: "Tech", description: "UI Frontend", niveau: "Avance" },
  { id: 202, nom: "Node.js", categorie: "Tech", description: "API Backend", niveau: "Intermediaire" },
  { id: 203, nom: "Power BI", categorie: "Data", description: "Visualisation", niveau: "Intermediaire" },
  { id: 204, nom: "Budget", categorie: "Finance", description: "Pilotage budgetaire", niveau: "Avance" },
  { id: 205, nom: "Negociation", categorie: "Soft Skills", description: "Relations clients", niveau: "Avance" },
  { id: 206, nom: "Leadership", categorie: "Soft Skills", description: "Management", niveau: "Confirme" },
  { id: 207, nom: "Lean", categorie: "Operations", description: "Amelioration continue", niveau: "Intermediaire" },
  { id: 208, nom: "CRM", categorie: "Commercial", description: "Gestion clients", niveau: "Intermediaire" },
  { id: 209, nom: "Strategie", categorie: "Marketing", description: "Positionnement", niveau: "Avance" },
  { id: 210, nom: "Excel", categorie: "Finance", description: "Analyse", niveau: "Avance" }
];

export const employeeSkillLevels = [
  {
    id: 301,
    employe: "Ahmed El Amrani",
    competences: [
      { nom: "React", niveau: 4 },
      { nom: "Node.js", niveau: 3 },
      { nom: "Architecture", niveau: 3 }
    ]
  },
  {
    id: 302,
    employe: "Sara Benali",
    competences: [
      { nom: "Reporting", niveau: 4 },
      { nom: "Budget", niveau: 3 },
      { nom: "Excel", niveau: 5 }
    ]
  },
  {
    id: 303,
    employe: "Youssef Karim",
    competences: [
      { nom: "Talent", niveau: 4 },
      { nom: "Communication", niveau: 4 },
      { nom: "Negociation", niveau: 3 }
    ]
  }
];

export const careerDashboardStats = {
  promotions: 18,
  vacancies: 4,
  grades: [
    { label: "G1", value: 8 },
    { label: "G2", value: 16 },
    { label: "G3", value: 12 },
    { label: "G4", value: 7 },
    { label: "G5", value: 3 }
  ],
  promotionsByMonth: [
    { month: "Sep", value: 2 },
    { month: "Oct", value: 3 },
    { month: "Nov", value: 4 },
    { month: "Dec", value: 2 },
    { month: "Jan", value: 4 },
    { month: "Feb", value: 3 }
  ]
};

export const trainings = [
  {
    id: 401,
    code: "FORM-001",
    titre: "Leadership Agile",
    domaine: "Management",
    type: "Interne",
    duree: "3 jours",
    statut: "En cours",
    date_debut: "2026-02-10",
    date_fin: "2026-02-13",
    budget: 12000,
    organisme: "Institut Management Maroc",
    participants: [
      { id: 1, employe: "Ahmed El Amrani", departement: "Informatique", note: "-", commentaire: "" },
      { id: 2, employe: "Youssef Karim", departement: "RH", note: "-", commentaire: "Très impliqué" }
    ],
    suggested: [
      { id: 11, employe: "Lina Omari", raison: "Potentiel leadership" },
      { id: 12, employe: "Nora Kabbaj", raison: "Role transversal" }
    ]
  },
  {
    id: 402,
    code: "FORM-002",
    titre: "Power BI Essentials",
    domaine: "Data",
    type: "Externe",
    duree: "2 jours",
    statut: "En attente",
    date_debut: "2026-03-05",
    date_fin: "2026-03-07",
    budget: 8000,
    organisme: "DataSkills Academy",
    participants: [
      { id: 3, employe: "Sara Benali", departement: "Finance", note: "-", commentaire: "" }
    ],
    suggested: [
      { id: 13, employe: "Hassan Tazi", raison: "Reporting production" }
    ]
  },
  {
    id: 403,
    code: "FORM-003",
    titre: "Sales Excellence",
    domaine: "Commercial",
    type: "Externe",
    duree: "4 jours",
    statut: "Termine",
    date_debut: "2025-12-02",
    date_fin: "2025-12-06",
    budget: 15000,
    organisme: "SalesForce Training",
    participants: [
      { id: 4, employe: "Nora Kabbaj", departement: "Commercial", note: 16, commentaire: "Excellente participation" }
    ],
    suggested: []
  },
  {
    id: 404,
    code: "FORM-004",
    titre: "Lean Operations",
    domaine: "Operations",
    type: "Interne",
    duree: "3 jours",
    statut: "En cours",
    date_debut: "2026-02-01",
    date_fin: "2026-02-04",
    budget: 10000,
    organisme: "Lean Institute",
    participants: [
      { id: 5, employe: "Hassan Tazi", departement: "Production", note: "-", commentaire: "" }
    ],
    suggested: []
  }
];

export const trainingTrackingRows = [
  {
    id: 501,
    formation: "Leadership Agile",
    employe: "Ahmed El Amrani",
    statut: "En cours",
    note: "-",
    attestation: "",
    documents: []
  },
  {
    id: 502,
    formation: "Leadership Agile",
    employe: "Youssef Karim",
    statut: "En cours",
    note: "-",
    attestation: "",
    documents: []
  },
  {
    id: 503,
    formation: "Sales Excellence",
    employe: "Nora Kabbaj",
    statut: "Termine",
    note: 16,
    attestation: "attestation.pdf",
    documents: [
      { id: 1, original_name: "attestation_nora.pdf", created_at: "2026-02-09 10:59:48" }
    ]
  },
  {
    id: 504,
    formation: "Power BI Essentials",
    employe: "Sara Benali",
    statut: "En attente",
    note: "-",
    attestation: "",
    documents: []
  }
];

export const trainingDashboardStats = {
  active: 6,
  successRate: 86,
  budgetUsed: 42000,
  byStatus: [
    { label: "En attente", value: 2 },
    { label: "En cours", value: 3 },
    { label: "Termine", value: 1 }
  ],
  budgetByMonth: [
    { month: "Sep", value: 6000 },
    { month: "Oct", value: 9000 },
    { month: "Nov", value: 7000 },
    { month: "Dec", value: 11000 },
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 4000 }
  ]
};
