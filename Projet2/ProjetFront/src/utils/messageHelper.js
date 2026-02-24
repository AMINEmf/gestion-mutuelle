import Swal from 'sweetalert2';

/**
 * Dictionnaire de traduction des erreurs backend (Laravel) vers français
 */
const ERROR_TRANSLATIONS = {
  // Validation Laravel
  'The statut field is required.': 'Le champ Statut est obligatoire.',
  'The date_operation field is required.': 'Le champ Date d\'opération est obligatoire.',
  'The type_operation field is required.': 'Le champ Type d\'opération est obligatoire.',
  'The affiliation_id field is required.': 'Le champ Affiliation est obligatoire.',
  'The employe_id field is required.': 'Le champ Employé est obligatoire.',
  'The mutuelle_id field is required.': 'Le champ Mutuelle est obligatoire.',
  'The regime_id field is required.': 'Le champ Régime est obligatoire.',
  'The date_affiliation field is required.': 'Le champ Date d\'affiliation est obligatoire.',
  'The numero_adherent field is required.': 'Le champ Numéro adhérent est obligatoire.',
  'The nom field is required.': 'Le champ Nom est obligatoire.',
  'The prenom field is required.': 'Le champ Prénom est obligatoire.',
  'The email field is required.': 'Le champ Email est obligatoire.',
  'The telephone field is required.': 'Le champ Téléphone est obligatoire.',
  
  // Erreurs de format
  'The email must be a valid email address.': 'L\'adresse email doit être valide.',
  'The date must be a valid date.': 'La date doit être valide.',
  'The montant must be a number.': 'Le montant doit être un nombre.',
  
  // Erreurs d'authentification / autorisation
  'Unauthenticated.': 'Vous devez être connecté pour effectuer cette action.',
  'Unauthorized.': 'Vous n\'êtes pas autorisé à effectuer cette action.',
  'This action is unauthorized.': 'Vous n\'êtes pas autorisé à effectuer cette action.',
  
  // Erreurs de ressource
  'Not Found': 'La ressource demandée est introuvable.',
  'Resource not found': 'La ressource est introuvable.',
  
  // Erreurs serveur
  'Server Error': 'Une erreur serveur est survenue. Veuillez réessayer.',
  'Internal Server Error': 'Une erreur serveur est survenue. Veuillez réessayer.',
};

/**
 * Traduit un message d'erreur anglais en français
 * @param {string} message - Message à traduire
 * @returns {string} - Message traduit ou message original si pas de traduction
 */
const translateErrorMessage = (message) => {
  if (!message) return 'Une erreur est survenue.';
  
  // Exact match
  if (ERROR_TRANSLATIONS[message]) {
    return ERROR_TRANSLATIONS[message];
  }
  
  // Partial match pour les messages avec patterns
  for (const [englishKey, frenchValue] of Object.entries(ERROR_TRANSLATIONS)) {
    if (message.includes(englishKey)) {
      return frenchValue;
    }
  }
  
  // Si le message contient "field is required", on essaie d'extraire le nom du champ
  const requiredMatch = message.match(/The (\w+) field is required/i);
  if (requiredMatch) {
    const fieldName = requiredMatch[1];
    return `Le champ ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} est obligatoire.`;
  }
  
  // Si pas de traduction trouvée et que le message est en anglais, on retourne un message générique
  if (/^[A-Za-z\s.,!?]+$/.test(message)) {
    return 'Une erreur est survenue. Veuillez vérifier les informations saisies.';
  }
  
  return message;
};

/**
 * Extrait et traduit les messages d'erreur de la réponse Axios
 * @param {object} error - Objet erreur Axios
 * @returns {string} - Message d'erreur traduit en français
 */
export const extractErrorMessage = (error) => {
  if (!error) return 'Une erreur est survenue.';
  
  // Erreur réseau
  if (!error.response) {
    return 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
  }
  
  const { status, data } = error.response;
  
  // Erreurs d'authentification
  if (status === 401) {
    return 'Vous devez être connecté pour effectuer cette action.';
  }
  
  if (status === 403) {
    return 'Vous n\'êtes pas autorisé à effectuer cette action.';
  }
  
  if (status === 404) {
    return 'La ressource demandée est introuvable.';
  }
  
  if (status === 500) {
    return 'Une erreur serveur est survenue. Veuillez réessayer.';
  }
  
  // Erreurs de validation Laravel (422)
  if (status === 422 && data?.errors) {
    const errors = Object.values(data.errors).flat();
    const translatedErrors = errors.map(err => translateErrorMessage(err));
    return translatedErrors.join('\n');
  }
  
  // Message simple
  if (data?.message) {
    return translateErrorMessage(data.message);
  }
  
  return 'Une erreur est survenue. Veuillez réessayer.';
};

/**
 * Configuration par défaut pour SweetAlert2
 * IMPORTANT : input: false pour supprimer la checkbox/input
 */
const DEFAULT_SWAL_CONFIG = {
  buttonsStyling: true,
  confirmButtonColor: '#007580',
  cancelButtonColor: '#6c757d',
  input: false, // ← ESSENTIEL : Pas d'input/checkbox
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster'
  }
};

/**
 * Affiche un message de succès
 * @param {string} title - Titre du message
 * @param {string} text - Texte du message (optionnel)
 * @param {object} options - Options supplémentaires SweetAlert2
 */
export const showSuccessMessage = (title, text = '', options = {}) => {
  return Swal.fire({
    ...DEFAULT_SWAL_CONFIG,
    icon: 'success',
    title,
    text,
    input: false, // Force pas d'input
    ...options
  });
};

/**
 * Affiche un message d'erreur
 * @param {string} title - Titre de l'erreur
 * @param {string} text - Détails de l'erreur
 * @param {object} options - Options supplémentaires SweetAlert2
 */
export const showErrorMessage = (title = 'Erreur', text = '', options = {}) => {
  return Swal.fire({
    ...DEFAULT_SWAL_CONFIG,
    icon: 'error',
    title,
    text,
    input: false, // Force pas d'input
    ...options
  });
};

/**
 * Affiche une erreur à partir d'un objet error Axios
 * @param {object} error - Objet erreur Axios
 * @param {string} defaultTitle - Titre par défaut
 */
export const showErrorFromResponse = (error, defaultTitle = 'Erreur') => {
  const message = extractErrorMessage(error);
  return showErrorMessage(defaultTitle, message);
};

/**
 * Affiche un message d'information
 * @param {string} title - Titre du message
 * @param {string} text - Texte du message
 * @param {object} options - Options supplémentaires SweetAlert2
 */
export const showInfoMessage = (title, text = '', options = {}) => {
  return Swal.fire({
    ...DEFAULT_SWAL_CONFIG,
    icon: 'info',
    title,
    text,
    input: false, // Force pas d'input
    ...options
  });
};

/**
 * Affiche un message de confirmation
 * @param {string} title - Titre de la confirmation
 * @param {string} text - Texte de la confirmation
 * @param {object} options - Options supplémentaires SweetAlert2
 * @returns {Promise} - Promesse avec le résultat (isConfirmed)
 */
export const showConfirmDialog = (title, text = '', options = {}) => {
  return Swal.fire({
    ...DEFAULT_SWAL_CONFIG,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler',
    input: false, // Force pas d'input
    ...options
  });
};

/**
 * Affiche un toast de succès (notification discrète)
 * @param {string} message - Message à afficher
 * @param {number} timer - Durée en ms (défaut: 3000)
 */
export const showSuccessToast = (message, timer = 3000) => {
  return Swal.fire({
    icon: 'success',
    title: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    input: false, // Force pas d'input
  });
};

/**
 * Affiche un toast d'erreur (notification discrète)
 * @param {string} message - Message à afficher
 * @param {number} timer - Durée en ms (défaut: 3000)
 */
export const showErrorToast = (message, timer = 3000) => {
  return Swal.fire({
    icon: 'error',
    title: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    input: false, // Force pas d'input
  });
};

/**
 * Messages standards pour actions CRUD
 */
export const STANDARD_MESSAGES = {
  // Succès
  CREATE_SUCCESS: 'Ajout effectué avec succès.',
  UPDATE_SUCCESS: 'Modification enregistrée avec succès.',
  DELETE_SUCCESS: 'Suppression effectuée avec succès.',
  UPLOAD_SUCCESS: 'Document ajouté avec succès.',
  SAVE_SUCCESS: 'Enregistrement effectué avec succès.',
  
  // Confirmations
  DELETE_CONFIRM_TITLE: 'Confirmer la suppression',
  DELETE_CONFIRM_TEXT: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  DELETE_MULTIPLE_CONFIRM_TEXT: 'Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ? Cette action est irréversible.',
  
  // Erreurs
  VALIDATION_ERROR: 'Veuillez corriger les erreurs du formulaire.',
  REQUIRED_FIELDS: 'Veuillez renseigner tous les champs obligatoires (*).',
  NETWORK_ERROR: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
  GENERIC_ERROR: 'Une erreur est survenue. Veuillez réessayer.',
  UPLOAD_ERROR: 'Erreur lors de l\'upload du document.',
  DELETE_ERROR: 'Erreur lors de la suppression.',
};

// Export par défaut pour faciliter l'import
export default {
  extractErrorMessage,
  showSuccessMessage,
  showErrorMessage,
  showErrorFromResponse,
  showInfoMessage,
  showConfirmDialog,
  showSuccessToast,
  showErrorToast,
  STANDARD_MESSAGES,
};
