# 🔧 CORRECTIONS APPLIQUÉES - ERR_CONNECTION_REFUSED

## ✅ PROBLÈME RÉSOLU

### Cause racine
Le serveur Laravel backend n'était **PAS en cours d'exécution**, causant l'erreur `ERR_CONNECTION_REFUSED`.

---

## 🚀 CORRECTIONS APPLIQUÉES

### 1️⃣ Backend - Serveur Laravel lancé
**Terminal ID**: `bc310587-25c0-4716-a474-20c2b3016cc5`
```powershell
cd C:\wampServer64\www\rh-sps-stage\Projet2\GestionBE
php artisan serve --host=127.0.0.1 --port=8000
```
✅ **Statut**: Serveur actif sur `http://127.0.0.1:8000`

---

### 2️⃣ Frontend - Configuration Vite avec Proxy

**Fichier créé**: [.env](c:/wampServer64/www/rh-sps-stage/Projet2/ProjetFront/.env)
```env
VITE_API_URL=http://127.0.0.1:8000
```

**Fichier modifié**: [vite.config.js](c:/wampServer64/www/rh-sps-stage/Projet2/ProjetFront/vite.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

**Avantage du proxy**:
- ✅ Les URLs relatives (`/api/postes`) fonctionnent
- ✅ Pas de problèmes CORS
- ✅ Configuration centralisée

---

### 3️⃣ Frontend - apiClient.js avec support proxy

**Fichier modifié**: [apiClient.js](c:/wampServer64/www/rh-sps-stage/Projet2/ProjetFront/src/services/apiClient.js)

**Changements**:
- ✅ Utilise `VITE_API_URL` si définie
- ✅ Sinon utilise le proxy Vite (`/api`)
- ✅ Ajoute automatiquement le token Bearer
- ✅ Support des URLs relatives et absolues

---

### 4️⃣ Frontend - Intercepteur fetch dans main.jsx

**Fichier modifié**: [main.jsx](c:/wampServer64/www/rh-sps-stage/Projet2/ProjetFront/src/main.jsx)

**Changement**:
- ✅ Support des URLs relatives (`/api/...`)
- ✅ Ajoute le token pour toutes les requêtes API

---

### 5️⃣ Frontend - Login.jsx URL cohérente

**Fichier modifié**: [Login.jsx](c:/wampServer64/www/rh-sps-stage/Projet2/ProjetFront/src/Login/Login.jsx)

**Changement**:
- ❌ Avant: `http://localhost:8000/api/login`
- ✅ Après: `http://127.0.0.1:8000/api/login`

---

## 📋 ÉTAPES À SUIVRE

### 1. Redémarrer le serveur Vite
```powershell
# Dans le terminal Vite (appuyez sur Ctrl+C pour arrêter)
# Puis relancez:
cd C:\wampServer64\www\rh-sps-stage\Projet2\ProjetFront
npm run dev
```

### 2. Vider le cache du navigateur
1. Ouvrir la console du navigateur (F12)
2. Aller dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
3. Cliquer sur "Clear storage" ou "Vider le stockage"
4. **OU** exécuter dans la console:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 3. Se reconnecter
1. Aller sur `http://localhost:5173/login`
2. Se connecter avec vos identifiants
3. Naviguer vers "Gestion des postes & grades"

---

## ✅ VÉRIFICATIONS

### Backend (doit être en cours d'exécution)
```powershell
# Vérifier que le serveur Laravel répond
Invoke-RestMethod -Uri "http://127.0.0.1:8000" -TimeoutSec 5
```
**Résultat attendu**: Pas d'erreur de connexion (même si 401/404)

### Frontend
```powershell
# Vérifier que Vite écoute sur le port 5173
netstat -ano | Select-String ":5173"
```
**Résultat attendu**: `LISTENING` sur le port 5173

### API avec authentification
Une fois connecté, ouvrir la console du navigateur (F12) et vérifier:
```javascript
// Doit afficher les grades
fetch('/api/grades', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('API_TOKEN')}`
  }
}).then(r => r.json()).then(console.log)
```

---

## 🎯 RÉSULTAT ATTENDU

Après redémarrage du serveur Vite et reconnexion:

✅ `/api/postes` → **6 postes** affichés
✅ `/api/grades` → **5 grades** (G1-G5) disponibles
✅ `/api/competences` → **18 compétences** chargées
✅ `/api/departements/hierarchy` → Hiérarchie des départements
✅ `/api/user` → Informations utilisateur

**Plus d'erreur `ERR_CONNECTION_REFUSED` !**

---

## 🔍 DIAGNOSTIC EN CAS DE PROBLÈME

### Erreur 401 Unauthorized
- ✅ Normal si pas connecté
- Solution: Se reconnecter via `/login`

### Erreur CORS
- Vérifier que le proxy Vite est configuré
- Vérifier [config/cors.php](c:/wampServer64/www/rh-sps-stage/Projet2/GestionBE/config/cors.php)

### Données vides malgré 200 OK
- Vérifier les seeders:
```powershell
cd C:\wampServer64\www\rh-sps-stage\Projet2\GestionBE
php artisan db:seed --class=GpServicesUnitesSeeder
php artisan db:seed --class=GpPostesSeeder
```

---

## 📊 RÉSUMÉ DES DONNÉES DISPONIBLES

```
Backend Laravel: http://127.0.0.1:8000
Frontend Vite:   http://localhost:5173

Tables:
- gp_grades           : 5 enregistrements
- gp_competences      : 18 enregistrements  
- gp_services         : 3 enregistrements
- gp_unites          : 4 enregistrements
- gp_postes          : 6 enregistrements
- gp_poste_competence: 25 relations
```
