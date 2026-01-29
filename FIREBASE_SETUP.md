# 🔥 Configuration Firebase - Budget Tracking

Ce guide vous explique comment configurer Firebase pour synchroniser vos données budgétaires entre vous et votre conjoint(e).

## 📋 Prérequis

- Un compte Google
- Node.js installé
- Le projet Budget Tracking cloné sur votre machine

## 🚀 Étape 1 : Configuration Firebase Console

### 1.1 Activer Authentication

1. Allez dans la [Console Firebase](https://console.firebase.google.com/)
2. Sélectionnez votre projet : `budget-tracking-56e6e`
3. Dans le menu latéral, cliquez sur **Authentication**
4. Cliquez sur l'onglet **Sign-in method**
5. Activez **Email/Password** :
   - Cliquez sur "Email/Password"
   - Activez le premier bouton (Email/Password)
   - Cliquez sur "Enregistrer"

### 1.2 Activer Firestore Database

1. Dans le menu latéral, cliquez sur **Firestore Database**
2. Cliquez sur **Créer une base de données**
3. Choisissez **Commencer en mode test** (nous allons configurer les règles après)
4. Sélectionnez la région : **europe-west1** (Belgique) ou **europe-west3** (Francfort)
5. Cliquez sur **Activer**

### 1.3 Configurer les règles de sécurité Firestore

Une fois Firestore créé, configurez les règles de sécurité :

1. Allez dans **Firestore Database** > **Règles**
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règle pour la collection budgetData
    match /budgetData/{accountId}/months/{month} {
      // Autorise la lecture et l'écriture uniquement si l'utilisateur est authentifié
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Cliquez sur **Publier**

**Explication des règles** :
- Seuls les utilisateurs authentifiés peuvent lire/écrire
- Tous les utilisateurs connectés partagent les mêmes données du compte `mathieu-assia-account`
- C'est parfait pour un budget familial partagé entre deux personnes

## 🔐 Étape 2 : Variables d'environnement (déjà configuré)

Créez un fichier `.env` à la racine du projet avec vos clés Firebase :

```bash
VITE_FIREBASE_API_KEY=votre_api_key_ici
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

**Important** : Ce fichier `.env` est dans le `.gitignore`, donc il ne sera pas versionné sur Git.

## 👥 Étape 3 : Créer vos comptes utilisateurs

### Pour Mathieu (premier utilisateur)

1. Démarrez l'application : `npm run dev`
2. Sur l'écran de connexion, cliquez sur **"Pas encore de compte ? Créez-en un"**
3. Entrez votre email : par exemple `mathieu@example.com`
4. Entrez un mot de passe (minimum 6 caractères) : `VotreMotDePasse123*`
5. Cliquez sur **Créer mon compte**

### Pour Assia (deuxième utilisateur)

1. Sur un autre appareil (ou après déconnexion), allez sur l'écran de connexion
2. Cliquez sur **"Pas encore de compte ? Créez-en un"**
3. Entrez votre email : par exemple `assia@example.com`
4. Entrez un mot de passe : `VotreMotDePasse123*`
5. Cliquez sur **Créer mon compte**

**Important** : Les deux comptes partagent automatiquement les mêmes données budgétaires car ils utilisent le même `SHARED_ACCOUNT_ID` dans Firestore.

## 📊 Étape 4 : Migration des données localStorage (optionnel)

Si vous avez déjà des données dans votre localStorage (ancienne version), vous pouvez les migrer vers Firestore.

**Attention** : Cette opération ne peut être faite qu'une seule fois par le premier utilisateur.

### Option 1 : Migration automatique (recommandé)

Ajoutez temporairement ce bouton dans votre composant principal :

```tsx
import { migrateFromLocalStorage } from '../services/firestoreService';

// Dans votre composant
<button onClick={() => migrateFromLocalStorage()}>
  Migrer les données localStorage vers Firestore
</button>
```

### Option 2 : Migration manuelle

1. Ouvrez la console développeur (F12)
2. Tapez dans la console :

```javascript
import { migrateFromLocalStorage } from './src/services/firestoreService';
await migrateFromLocalStorage();
```

## ✅ Vérification

### Tester le partage des données

1. **Sur l'appareil de Mathieu** :
   - Connectez-vous avec le compte de Mathieu
   - Ajoutez un nouveau projet ou une dépense
   - La donnée devrait être sauvegardée

2. **Sur l'appareil d'Assia** :
   - Connectez-vous avec le compte d'Assia
   - Rechargez la page
   - Vous devriez voir la même donnée que Mathieu vient d'ajouter

3. **Vérification dans Firebase Console** :
   - Allez dans **Firestore Database**
   - Vous devriez voir la collection `budgetData`
   - Puis le document `mathieu-assia-account`
   - Puis la sous-collection `months` avec vos données

## 🔒 Sécurité

### Ce qui est sécurisé

✅ Les mots de passe sont hashés par Firebase (jamais stockés en clair)
✅ Les clés API sont dans `.env` (non versionné sur Git)
✅ Les données ne sont accessibles qu'aux utilisateurs authentifiés
✅ Connexion HTTPS obligatoire

### Points d'attention

⚠️ Tous les utilisateurs authentifiés partagent les mêmes données
⚠️ Si vous voulez séparer les comptes, il faut modifier le `SHARED_ACCOUNT_ID` dans `firestoreService.ts`
⚠️ Les règles actuelles permettent à tout utilisateur authentifié de lire/écrire (adapté pour un couple)

## 🔧 Dépannage

### Erreur : "permission-denied"

**Cause** : Les règles Firestore ne sont pas correctement configurées.
**Solution** : Vérifiez les règles Firestore (Étape 1.3).

### Erreur : "auth/network-request-failed"

**Cause** : Problème de connexion réseau.
**Solution** : Vérifiez votre connexion internet et les paramètres de pare-feu.

### Les données ne se synchronisent pas

**Cause** : Vérifiez que vous utilisez bien le même `SHARED_ACCOUNT_ID`.
**Solution** : Dans `src/services/firestoreService.ts`, vérifiez la valeur de `SHARED_ACCOUNT_ID`.

### Erreur : "Environment variables not defined"

**Cause** : Le fichier `.env` n'est pas chargé.
**Solution** :
- Vérifiez que `.env` existe à la racine du projet
- Redémarrez le serveur de développement : `npm run dev`

## 📱 Déploiement

Pour déployer l'application en production :

1. **Vérifiez les règles Firestore** en production
2. **Configurez un domaine personnalisé** (optionnel)
3. **Activez les règles de sécurité strictes**
4. **Configurez Firebase Hosting** :

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📚 Documentation supplémentaire

- [Documentation Firebase Authentication](https://firebase.google.com/docs/auth)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Règles de sécurité Firestore](https://firebase.google.com/docs/firestore/security/get-started)

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez ce guide de configuration
2. Consultez les logs de la console développeur (F12)
3. Vérifiez les logs Firestore dans la Console Firebase

---

**Dernière mise à jour** : Janvier 2026
**Version Firebase** : 12.8.0
