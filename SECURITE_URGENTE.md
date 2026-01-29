# 🚨 ACTIONS DE SÉCURITÉ URGENTES

## ⚠️ Situation

Vos clés Firebase ont été exposées sur GitHub dans les fichiers de documentation.
GitHub vous a envoyé une alerte à ce sujet.

## ✅ Ce qui a été fait

- ✅ Suppression des clés de DEPLOIEMENT.md et FIREBASE_SETUP.md
- ✅ Commit et push sur GitHub

## 🔐 CE QUE VOUS DEVEZ FAIRE MAINTENANT

### Option 1 : Restreindre la clé API (RECOMMANDÉ)

Les clés Firebase côté client sont publiques par design, mais vous devez les restreindre :

1. **Allez sur Google Cloud Console** :
   https://console.cloud.google.com/apis/credentials?project=budget-tracking-56e6e

2. **Trouvez votre clé API** (celle qui commence par AIzaSyCP...)

3. **Cliquez sur "Modifier"**

4. **Restrictions d'application** :
   - Sélectionnez "Référents HTTP (sites Web)"
   - Ajoutez :
     ```
     https://budget-tracking-56e6e.web.app/*
     https://budget-tracking-56e6e.firebaseapp.com/*
     http://localhost:5173/*
     ```

5. **Restrictions d'API** :
   - Sélectionnez "Limiter la clé"
   - Cochez uniquement :
     - Firebase Authentication API
     - Cloud Firestore API
     - Firebase Installations API

6. **Enregistrer**

### Option 2 : Créer une nouvelle clé API (PLUS SÛR)

Si vous voulez être totalement sûr :

1. **Allez sur Firebase Console** :
   https://console.firebase.google.com/project/budget-tracking-56e6e/settings/general

2. **Supprimez l'ancienne application web** et créez-en une nouvelle

3. **Copiez la nouvelle configuration**

4. **Mettez à jour votre `.env` local** avec les nouvelles clés

5. **Rebuild et redéploiement** :
   ```bash
   npm run deploy
   ```

## 📋 Après avoir sécurisé les clés

### Vérifiez la sécurité Firestore

Vos règles Firestore sont déjà bonnes :

```javascript
// Seuls les utilisateurs authentifiés peuvent accéder
allow read, write: if request.auth != null;
```

✅ C'est suffisant pour protéger vos données.

## 💡 Important à savoir

**Les clés API Firebase côté client ne sont PAS des secrets** :
- Elles sont publiques (dans le JavaScript du navigateur)
- La sécurité vient des **règles Firestore** et des **restrictions de clé**
- C'est différent des clés serveur (qui DOIVENT rester secrètes)

**Pourquoi GitHub alerte ?**
- GitHub détecte automatiquement les clés Google
- Par précaution, il vous alerte
- Mais tant que la clé est RESTREINTE, ce n'est pas grave

## ✅ Checklist finale

- [ ] Restreindre la clé API dans Google Cloud Console
- [ ] Vérifier que les domaines autorisés sont corrects
- [ ] Vérifier que les règles Firestore sont actives
- [ ] Tester l'application en production

## 🔗 Liens utiles

- **Google Cloud Console (Clés API)** : https://console.cloud.google.com/apis/credentials?project=budget-tracking-56e6e
- **Firebase Console (Règles)** : https://console.firebase.google.com/project/budget-tracking-56e6e/firestore/rules
- **Documentation Firebase Sécurité** : https://firebase.google.com/docs/projects/api-keys

---

**Ne paniquez pas !** C'est une situation courante avec Firebase.
L'important est de RESTREINDRE la clé, pas de la garder secrète.
