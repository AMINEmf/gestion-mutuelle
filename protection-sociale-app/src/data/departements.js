// Structure hiérarchique des départements

export const departements = [
  {
    id: 1,
    nom: "Direction Générale",
    code: "DG",
    children: [
      {
        id: 2,
        nom: "Direction RH",
        code: "DRH",
        children: [
          { id: 7, nom: "Service Paie", code: "PAIE", children: [] },
          { id: 8, nom: "Service Recrutement", code: "RECR", children: [] },
          { id: 9, nom: "Service Formation", code: "FORM", children: [] },
        ],
      },
      {
        id: 3,
        nom: "Direction Financière",
        code: "DFIN",
        children: [
          { id: 10, nom: "Comptabilité", code: "COMPTA", children: [] },
          { id: 11, nom: "Contrôle de Gestion", code: "CDG", children: [] },
          { id: 12, nom: "Trésorerie", code: "TRES", children: [] },
        ],
      },
      {
        id: 4,
        nom: "Direction Technique",
        code: "DTECH",
        children: [
          { id: 13, nom: "Développement", code: "DEV", children: [] },
          { id: 14, nom: "Infrastructure", code: "INFRA", children: [] },
          { id: 15, nom: "Support IT", code: "SUPIT", children: [] },
        ],
      },
      {
        id: 5,
        nom: "Direction Commerciale",
        code: "DCOM",
        children: [
          { id: 16, nom: "Ventes", code: "VENTES", children: [] },
          { id: 17, nom: "Marketing", code: "MKT", children: [] },
          { id: 18, nom: "Service Client", code: "SAV", children: [] },
        ],
      },
      {
        id: 6,
        nom: "Direction Production",
        code: "DPROD",
        children: [
          { id: 19, nom: "Atelier A", code: "ATEL-A", children: [] },
          { id: 20, nom: "Atelier B", code: "ATEL-B", children: [] },
          { id: 21, nom: "Qualité", code: "QUAL", children: [] },
          { id: 22, nom: "Maintenance", code: "MAINT", children: [] },
        ],
      },
    ],
  },
];

// Employés enrichis avec département_id
export const employesWithDept = [
  // Direction Générale
  { id: 1, matricule: "EMP001", nom: "FASSI", prenom: "Youssef", cin: "IJ567890", dateNaissance: "1975-12-18", dateEmbauche: "2010-04-20", poste: "Directeur Général", departement_id: 1, salaire: 45000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "y.fassi@entreprise.ma", telephone: "0661234567" },
  
  // Direction RH
  { id: 2, matricule: "EMP002", nom: "TAZI", prenom: "Mohamed", cin: "EF345678", dateNaissance: "1982-11-08", dateEmbauche: "2015-03-15", poste: "DRH", departement_id: 2, salaire: 28000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "m.tazi@entreprise.ma", telephone: "0662345678" },
  { id: 3, matricule: "EMP003", nom: "BERRADA", prenom: "Salma", cin: "KL234567", dateNaissance: "1990-02-14", dateEmbauche: "2019-02-01", poste: "Responsable Paie", departement_id: 7, salaire: 15000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "s.berrada@entreprise.ma", telephone: "0663456789" },
  { id: 4, matricule: "EMP004", nom: "HAMIDI", prenom: "Rachid", cin: "AA112233", dateNaissance: "1988-06-22", dateEmbauche: "2020-01-15", poste: "Gestionnaire Paie", departement_id: 7, salaire: 9000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "r.hamidi@entreprise.ma", telephone: "0664567890" },
  { id: 5, matricule: "EMP005", nom: "BENNIS", prenom: "Amina", cin: "BB223344", dateNaissance: "1992-09-10", dateEmbauche: "2021-03-01", poste: "Chargée Recrutement", departement_id: 8, salaire: 11000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "a.bennis@entreprise.ma", telephone: "0665678901" },
  { id: 6, matricule: "EMP006", nom: "AMRANI", prenom: "Khalid", cin: "CC334455", dateNaissance: "1985-04-05", dateEmbauche: "2018-07-01", poste: "Responsable Formation", departement_id: 9, salaire: 14000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "k.amrani@entreprise.ma", telephone: "0666789012" },
  
  // Direction Financière
  { id: 7, matricule: "EMP007", nom: "OUAZZANI", prenom: "Fatima", cin: "CD789012", dateNaissance: "1984-07-22", dateEmbauche: "2014-06-01", poste: "DAF", departement_id: 3, salaire: 30000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "f.ouazzani@entreprise.ma", telephone: "0667890123" },
  { id: 8, matricule: "EMP008", nom: "BENNANI", prenom: "Laila", cin: "OP456789", dateNaissance: "1987-06-12", dateEmbauche: "2016-11-15", poste: "Chef Comptable", departement_id: 10, salaire: 18000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "l.bennani@entreprise.ma", telephone: "0668901234" },
  { id: 9, matricule: "EMP009", nom: "IDRISSI", prenom: "Nadia", cin: "DD445566", dateNaissance: "1991-01-28", dateEmbauche: "2019-04-01", poste: "Comptable", departement_id: 10, salaire: 10000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "n.idrissi@entreprise.ma", telephone: "0669012345" },
  { id: 10, matricule: "EMP010", nom: "KADIRI", prenom: "Hassan", cin: "EE556677", dateNaissance: "1983-08-15", dateEmbauche: "2017-09-01", poste: "Contrôleur de Gestion", departement_id: 11, salaire: 16000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "h.kadiri@entreprise.ma", telephone: "0670123456" },
  { id: 11, matricule: "EMP011", nom: "FILALI", prenom: "Meryem", cin: "FF667788", dateNaissance: "1989-11-03", dateEmbauche: "2020-02-15", poste: "Trésorière", departement_id: 12, salaire: 14000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "m.filali@entreprise.ma", telephone: "0671234567" },
  
  // Direction Technique (IT)
  { id: 12, matricule: "EMP012", nom: "CHRAIBI", prenom: "Omar", cin: "MN890123", dateNaissance: "1980-09-25", dateEmbauche: "2012-08-10", poste: "DSI", departement_id: 4, salaire: 32000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "o.chraibi@entreprise.ma", telephone: "0672345678" },
  { id: 13, matricule: "EMP013", nom: "BENALI", prenom: "Ahmed", cin: "AB123456", dateNaissance: "1985-03-15", dateEmbauche: "2016-01-10", poste: "Lead Developer", departement_id: 13, salaire: 22000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "a.benali@entreprise.ma", telephone: "0673456789" },
  { id: 14, matricule: "EMP014", nom: "ALAOUI", prenom: "Khadija", cin: "GH901234", dateNaissance: "1992-05-30", dateEmbauche: "2020-09-01", poste: "Développeur Frontend", departement_id: 13, salaire: 15000, statutCNSS: "En cours", statutMutuelle: "En attente", photo: null, email: "k.alaoui@entreprise.ma", telephone: "0674567890" },
  { id: 15, matricule: "EMP015", nom: "ZIANI", prenom: "Mehdi", cin: "GG778899", dateNaissance: "1993-03-20", dateEmbauche: "2021-06-01", poste: "Développeur Backend", departement_id: 13, salaire: 14000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "m.ziani@entreprise.ma", telephone: "0675678901" },
  { id: 16, matricule: "EMP016", nom: "SEKKAT", prenom: "Karim", cin: "HH889900", dateNaissance: "1986-07-12", dateEmbauche: "2017-03-15", poste: "Admin Système", departement_id: 14, salaire: 17000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "k.sekkat@entreprise.ma", telephone: "0676789012" },
  { id: 17, matricule: "EMP017", nom: "RAMI", prenom: "Yassine", cin: "II990011", dateNaissance: "1994-12-08", dateEmbauche: "2022-01-10", poste: "Technicien Support", departement_id: 15, salaire: 8500, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "y.rami@entreprise.ma", telephone: "0677890123" },
  { id: 18, matricule: "EMP018", nom: "LAHLOU", prenom: "Sara", cin: "JJ001122", dateNaissance: "1995-02-25", dateEmbauche: "2022-04-01", poste: "Technicienne Support", departement_id: 15, salaire: 8000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "s.lahlou@entreprise.ma", telephone: "0678901234" },
  
  // Direction Commerciale
  { id: 19, matricule: "EMP019", nom: "BENJELLOUN", prenom: "Samir", cin: "KK112233", dateNaissance: "1979-05-18", dateEmbauche: "2011-02-01", poste: "Directeur Commercial", departement_id: 5, salaire: 28000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "s.benjelloun@entreprise.ma", telephone: "0679012345" },
  { id: 20, matricule: "EMP020", nom: "CHERKAOUI", prenom: "Hind", cin: "LL223344", dateNaissance: "1988-10-30", dateEmbauche: "2018-05-15", poste: "Responsable Ventes", departement_id: 16, salaire: 16000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "h.cherkaoui@entreprise.ma", telephone: "0680123456" },
  { id: 21, matricule: "EMP021", nom: "NACIRI", prenom: "Anas", cin: "MM334455", dateNaissance: "1990-01-14", dateEmbauche: "2019-08-01", poste: "Commercial", departement_id: 16, salaire: 11000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "a.naciri@entreprise.ma", telephone: "0681234567" },
  { id: 22, matricule: "EMP022", nom: "SQALLI", prenom: "Leila", cin: "NN445566", dateNaissance: "1991-04-22", dateEmbauche: "2020-03-01", poste: "Responsable Marketing", departement_id: 17, salaire: 15000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "l.sqalli@entreprise.ma", telephone: "0682345678" },
  { id: 23, matricule: "EMP023", nom: "BENMOUSSA", prenom: "Imane", cin: "OO556677", dateNaissance: "1993-08-07", dateEmbauche: "2021-01-15", poste: "Chargée SAV", departement_id: 18, salaire: 9500, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "i.benmoussa@entreprise.ma", telephone: "0683456789" },
  
  // Direction Production
  { id: 24, matricule: "EMP024", nom: "FASSI", prenom: "Driss", cin: "PP667788", dateNaissance: "1977-06-25", dateEmbauche: "2008-09-01", poste: "Directeur Production", departement_id: 6, salaire: 27000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "d.fassi@entreprise.ma", telephone: "0684567890" },
  { id: 25, matricule: "EMP025", nom: "ZAHIDI", prenom: "Mourad", cin: "QQ778899", dateNaissance: "1982-11-12", dateEmbauche: "2014-04-01", poste: "Chef Atelier A", departement_id: 19, salaire: 14000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "m.zahidi@entreprise.ma", telephone: "0685678901" },
  { id: 26, matricule: "EMP026", nom: "ALAMI", prenom: "Brahim", cin: "RR889900", dateNaissance: "1985-02-28", dateEmbauche: "2016-06-15", poste: "Opérateur A", departement_id: 19, salaire: 7500, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "b.alami@entreprise.ma", telephone: "0686789012" },
  { id: 27, matricule: "EMP027", nom: "TOUZANI", prenom: "Abdelilah", cin: "SS990011", dateNaissance: "1988-09-15", dateEmbauche: "2017-08-01", poste: "Opérateur A", departement_id: 19, salaire: 7500, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "a.touzani@entreprise.ma", telephone: "0687890123" },
  { id: 28, matricule: "EMP028", nom: "BOUAZZA", prenom: "Jamal", cin: "TT001122", dateNaissance: "1984-07-03", dateEmbauche: "2015-01-10", poste: "Chef Atelier B", departement_id: 20, salaire: 14000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "j.bouazza@entreprise.ma", telephone: "0688901234" },
  { id: 29, matricule: "EMP029", nom: "HARRAK", prenom: "Soufiane", cin: "UU112233", dateNaissance: "1990-12-20", dateEmbauche: "2019-03-01", poste: "Opérateur B", departement_id: 20, salaire: 7500, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "s.harrak@entreprise.ma", telephone: "0689012345" },
  { id: 30, matricule: "EMP030", nom: "MOUSSAOUI", prenom: "Zineb", cin: "VV223344", dateNaissance: "1987-05-10", dateEmbauche: "2016-09-01", poste: "Responsable Qualité", departement_id: 21, salaire: 16000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "z.moussaoui@entreprise.ma", telephone: "0690123456" },
  { id: 31, matricule: "EMP031", nom: "KABBAJ", prenom: "Reda", cin: "WW334455", dateNaissance: "1983-03-18", dateEmbauche: "2013-11-01", poste: "Chef Maintenance", departement_id: 22, salaire: 15000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "r.kabbaj@entreprise.ma", telephone: "0691234567" },
  { id: 32, matricule: "EMP032", nom: "LAROUI", prenom: "Othmane", cin: "XX445566", dateNaissance: "1991-08-25", dateEmbauche: "2020-05-01", poste: "Technicien Maintenance", departement_id: 22, salaire: 9000, statutCNSS: "Affilié", statutMutuelle: "Actif", photo: null, email: "o.laroui@entreprise.ma", telephone: "0692345678" },
];

// Données CNSS liées aux employés
export const cnssData = employesWithDept.map((emp, index) => ({
  id: index + 1,
  employeId: emp.id,
  numeroCNSS: emp.statutCNSS === "Affilié" ? `CNSS${String(emp.id).padStart(8, '0')}` : null,
  dateAffiliation: emp.statutCNSS === "Affilié" ? emp.dateEmbauche : null,
  cotisationsPayees: Math.floor(Math.random() * 50) + 10,
  dernierPaiement: "2026-01-15",
  montantMensuel: Math.round(emp.salaire * 0.0448),
}));

// Données Mutuelle liées aux employés
export const mutuelleData = employesWithDept.map((emp, index) => ({
  id: index + 1,
  employeId: emp.id,
  numeroAdherent: emp.statutMutuelle === "Actif" ? `MUT${String(emp.id).padStart(6, '0')}` : null,
  contratType: ["Standard", "Premium", "Famille"][Math.floor(Math.random() * 3)],
  dateAdhesion: emp.statutMutuelle === "Actif" ? emp.dateEmbauche : null,
  nbBeneficiaires: Math.floor(Math.random() * 4) + 1,
  cotisationMensuelle: [300, 600, 900][Math.floor(Math.random() * 3)],
  remboursementsAnnee: Math.floor(Math.random() * 10),
  montantRembourse: Math.floor(Math.random() * 15000),
}));

// Fonction utilitaire pour trouver un département par ID
export const findDepartment = (departments, id) => {
  for (const dept of departments) {
    if (dept.id === id) return dept;
    if (dept.children?.length) {
      const found = findDepartment(dept.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Fonction pour obtenir tous les IDs des sous-départements
export const getSubDepartmentIds = (departments, id) => {
  const ids = new Set([id]);
  const addIds = (dept) => {
    dept.children?.forEach((child) => {
      ids.add(child.id);
      addIds(child);
    });
  };
  const target = findDepartment(departments, id);
  if (target) addIds(target);
  return Array.from(ids);
};

// Fonction pour obtenir le nom complet du département (avec hiérarchie)
export const getDepartmentPath = (departments, id) => {
  const path = [];
  const findPath = (depts, targetId, currentPath = []) => {
    for (const dept of depts) {
      const newPath = [...currentPath, dept.nom];
      if (dept.id === targetId) {
        path.push(...newPath);
        return true;
      }
      if (dept.children?.length && findPath(dept.children, targetId, newPath)) {
        return true;
      }
    }
    return false;
  };
  findPath(departments, id);
  return path.join(" > ");
};
