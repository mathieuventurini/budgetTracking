# 🚀 Guide de déploiement - Firebase Hosting

## ✅ Configuration terminée

Tous les fichiers de configuration Firebase Hosting ont été créés :
- ✅ `firebase.json` - Configuration du hosting
- ✅ `.firebaserc` - Projet Firebase
- ✅ `firestore.indexes.json` - Index Firestore
- ✅ Script de déploiement dans `package.json`

## 📋 Prérequis

1. Firebase CLI installé ✅
2. Compte Google avec accès au projet Firebase ✅
3. Application buildée avec les variables d'environnement ✅

## 🎯 Déploiement en 3 étapes

### Étape 1 : Activer Firebase Hosting

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet : `budget-tracking-56e6e`
3. Menu latéral : **Hosting**
4. Cliquez sur **Commencer**
5. Suivez les étapes (pas besoin d'installer Firebase CLI, c'est déjà fait)

### Étape 2 : Connexion à Firebase

Dans votre terminal, exécutez :

```bash
firebase login
```

Cela va ouvrir votre navigateur pour vous connecter avec votre compte Google.

### Étape 3 : Déploiement

Une seule commande :

```bash
npm run deploy
```

Cette commande va :
1. Compiler TypeScript
2. Builder avec Vite (inclut les variables d'environnement)
3. Déployer sur Firebase Hosting

## ✨ Résultat

Après le déploiement, vous recevrez une URL comme :
```
https://budget-tracking-56e6e.web.app
```

Votre application sera accessible publiquement à cette adresse.

## 🔐 Variables d'environnement en production

**Important** : Les variables d'environnement (`.env`) sont **intégrées dans le build**.

Lorsque vous exécutez `npm run build`, Vite remplace automatiquement :
- `import.meta.env.VITE_FIREBASE_API_KEY` → `"AIzaSyCP1pCRIQveGariIAABAILfNJcOUmv9t04"`
- Etc.

Les clés sont donc **dans le code JavaScript** en production. C'est normal pour Firebase (les clés sont publiques, la sécurité se fait via les règles Firestore).

## 🔄 Redéploiement

Pour mettre à jour l'application après des modifications :

```bash
npm run deploy
```

## 🛠️ Commandes utiles

```bash
# Build seulement
npm run build

# Prévisualiser le build localement
npm run preview

# Déployer seulement (sans rebuild)
firebase deploy --only hosting

# Voir les logs de déploiement
firebase hosting:channel:list
```

## 🌐 Domaine personnalisé (optionnel)

1. Firebase Console → Hosting → **Add custom domain**
2. Suivez les instructions pour configurer votre DNS
3. Firebase gère automatiquement le certificat SSL

## 📊 Surveillance

- **Firebase Console** → **Hosting** pour voir les statistiques
- **Analytics** pour suivre l'utilisation
- **Performance Monitoring** pour les performances

## ⚠️ Sécurité

### Règles Firestore à vérifier

Assurez-vous que vos règles Firestore sont en production :

```bash
firebase deploy --only firestore:rules
```

Cela déploie les règles depuis `firestore.rules`.

### Règles actuelles

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

✅ Seuls les utilisateurs authentifiés peuvent accéder aux données.

## 🐛 Dépannage

### Erreur "Firebase project not found"
```bash
firebase use budget-tracking-56e6e
```

### Erreur "Not logged in"
```bash
firebase login --reauth
```

### Erreur de permission
Assurez-vous d'avoir les droits sur le projet Firebase.

---

**Prêt pour la production !** 🚀
