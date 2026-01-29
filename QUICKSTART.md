# ⚡ Démarrage rapide - 5 minutes

## 🎯 Objectif
Configurer Firebase et lancer l'application de budget partagé entre vous et votre femme.

## ✅ Étapes (5 min)

### 1️⃣ Configuration Firebase Console (2 min)

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet `budget-tracking-56e6e`

**Activer Authentication :**
- Menu : **Authentication** → **Sign-in method**
- Activez **Email/Password** (premier bouton)
- Cliquez sur **Enregistrer**

**Activer Firestore :**
- Menu : **Firestore Database** → **Créer une base de données**
- Choisissez **Mode test** → **Région : europe-west1** → **Activer**

**Configurer les règles :**
- Allez dans **Firestore Database** → **Règles**
- Remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /budgetData/{accountId}/months/{month} {
      allow read, write: if request.auth != null;
    }
  }
}
```
- Cliquez sur **Publier**

### 2️⃣ Lancer l'application (1 min)

```bash
npm install   # Installer les dépendances
npm run dev   # Lancer l'appli
```

L'app démarre sur http://localhost:5173

### 3️⃣ Créer les comptes (2 min)

**Pour Mathieu :**
1. Cliquez sur "Pas encore de compte ? Créez-en un"
2. Email : `mathieu@example.com` (ou votre vrai email)
3. Mot de passe : `VotreMotDePasse123*`
4. Créer le compte

**Pour Assia (sur un autre appareil/navigateur) :**
1. Même chose avec `assia@example.com`
2. Les données de Mathieu seront automatiquement visibles

## ✅ Vérification

1. **Mathieu** : Ajoutez un projet ou une dépense
2. **Assia** : Rechargez la page → Vous voyez la même donnée
3. **Firebase Console** : Allez dans Firestore → Voyez vos données dans `budgetData/mathieu-assia-account/months`

## 🎉 Terminé !

Vous avez maintenant :
- ✅ Authentification sécurisée
- ✅ Données synchronisées en temps réel
- ✅ Budget partagé entre vous deux
- ✅ Sauvegarde cloud automatique

## 📚 Pour aller plus loin

- **Configuration complète** : [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Documentation** : [README.md](./README.md)
- **Liste des changements** : [CHANGEMENTS_FIREBASE.md](./CHANGEMENTS_FIREBASE.md)

## 🆘 Problème ?

**Erreur "permission-denied"** → Vérifiez les règles Firestore (étape 1)
**Données ne se synchronisent pas** → Vérifiez votre connexion internet
**Erreur "env not defined"** → Vérifiez que `.env` existe et redémarrez `npm run dev`

---

**Temps total : 5 minutes** ⏱️
