# 💰 Budget Familial - Application de Suivi Budgétaire

Une application React moderne pour gérer et suivre votre budget familial, avec synchronisation temps réel via Firebase.

## ✨ Fonctionnalités

- 📊 **Tableau de bord interactif** - Visualisez vos revenus, dépenses et reste à vivre
- 💳 **Gestion des salaires** - Suivez vos revenus mensuels
- 🏠 **Charges fixes** - Loyer, électricité, assurances, etc.
- 🛒 **Dépenses exceptionnelles** - Achats ponctuels et imprévus
- 🎯 **Projets budgétaires** - Planifiez vos projets (vacances, rénovation, etc.)
- 📈 **Graphiques de tendance** - Analysez l'évolution de votre budget sur 6 mois
- 📱 **Design responsive** - Fonctionne sur mobile, tablette et desktop
- 🔐 **Authentification sécurisée** - Firebase Authentication
- ☁️ **Synchronisation cloud** - Partagez votre budget avec votre conjoint(e)
- 🔄 **Temps réel** - Les modifications sont synchronisées instantanément

## 🚀 Démarrage rapide

### Prérequis

- Node.js 16+ et npm
- Un compte Google pour Firebase

### Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd BudgetTraking
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Firebase**

Lisez le guide détaillé : [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

Résumé rapide :
- Activez Authentication (Email/Password) dans Firebase Console
- Activez Firestore Database
- Copiez les règles de sécurité depuis `firestore.rules`
- Le fichier `.env` est déjà configuré avec vos clés

4. **Lancer l'application en développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

5. **Créer votre compte**
- Sur l'écran de connexion, cliquez sur "Créer un compte"
- Entrez votre email et mot de passe
- Connectez-vous et commencez à gérer votre budget !

## 🏗️ Architecture technique

### Technologies utilisées

- **Frontend** : React 18.3.1 + TypeScript 5.6.3
- **Build Tool** : Vite 5.4.10
- **Styling** : Tailwind CSS 3.4.14
- **Graphiques** : Recharts 2.12.7
- **Icônes** : Lucide React 0.344.0
- **Backend** : Firebase 12.8.0
  - Authentication (Email/Password)
  - Firestore Database
  - Analytics

### Structure du projet

```
src/
├── components/        # Composants React
│   ├── auth/         # Authentification
│   ├── dashboard/    # Tableau de bord
│   ├── expenses/     # Gestion dépenses
│   ├── history/      # Historique
│   ├── income/       # Revenus
│   ├── layout/       # Layout principal
│   ├── projects/     # Projets
│   └── ui/           # Composants UI réutilisables
├── contexts/         # Context API (Auth, Budget)
├── hooks/            # Hooks personnalisés
├── services/         # Services (Firebase, Firestore)
├── types/            # Types TypeScript
├── utils/            # Utilitaires
├── config/           # Configuration (Firebase)
├── App.tsx           # Composant racine
└── main.tsx          # Point d'entrée
```

## 📊 Modèle de données

### MonthlyData (Données mensuelles)

```typescript
{
  id: string
  month: string              // Format: YYYY-MM
  salaries: Salary[]
  fixedCharges: FixedCharge[]
  exceptionalExpenses: ExceptionalExpense[]
  projects: Project[]
  createdAt: string
  updatedAt: string
}
```

### Structure Firestore

```
budgetData/
└── mathieu-assia-account/  (compte partagé)
    └── months/
        ├── 2026-01/
        ├── 2026-02/
        └── ...
```

## 🔐 Sécurité

### Règles de sécurité Firestore

```javascript
// Seuls les utilisateurs authentifiés peuvent accéder aux données
match /budgetData/{accountId}/months/{month} {
  allow read, write: if request.auth != null;
}
```

### Bonnes pratiques

✅ Les mots de passe sont hashés par Firebase
✅ Les clés API sont dans `.env` (non versionné)
✅ Connexion HTTPS obligatoire
✅ Validation des données côté client et serveur

## 📱 Utilisation

### Partage du budget entre conjoints

1. **Premier utilisateur** (ex: Mathieu)
   - Créer un compte avec son email
   - Ajouter les données budgétaires

2. **Deuxième utilisateur** (ex: Assia)
   - Créer un compte avec son email
   - Les données de Mathieu sont automatiquement accessibles

3. **Synchronisation**
   - Toutes les modifications sont synchronisées en temps réel
   - Les deux utilisateurs voient les mêmes données

### Fonctionnalités principales

#### 1. Gestion des salaires
- Ajoutez vos revenus mensuels
- Modifiez les montants chaque mois

#### 2. Charges fixes
- Ajoutez loyer, électricité, assurances, etc.
- Créez, modifiez ou supprimez vos charges

#### 3. Dépenses exceptionnelles
- Suivez vos achats ponctuels
- Ajoutez une description et une date

#### 4. Projets budgétaires
- Créez des projets (vacances, travaux, etc.)
- Définissez un budget total
- Allouez un montant mensuel
- Suivez l'avancement avec les statuts

#### 5. Visualisations
- **Jauge circulaire** : Reste à vivre avec code couleur
- **Graphique de tendance** : Évolution sur 6 mois
- **Tableau comparatif** : Historique détaillé

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev           # Lance le serveur de dev sur http://localhost:5173

# Build
npm run build         # Compile TypeScript et build Vite pour production

# Preview
npm run preview       # Prévisualise le build de production

# Linting
npm run lint          # Vérifie le code avec ESLint
```

## 🚀 Déploiement

### Firebase Hosting (recommandé)

1. Installer Firebase CLI
```bash
npm install -g firebase-tools
```

2. Se connecter
```bash
firebase login
```

3. Initialiser le projet
```bash
firebase init hosting
```

4. Déployer
```bash
npm run build
firebase deploy
```

### Autres options

- **Vercel** : Connectez votre repo GitHub
- **Netlify** : Déployez depuis votre repo Git
- **GitHub Pages** : Configurez GitHub Actions

## 📝 Migration depuis localStorage

Si vous aviez déjà des données en localStorage :

```typescript
import { migrateFromLocalStorage } from './src/services/firestoreService';

// Dans la console développeur
await migrateFromLocalStorage();
```

## 🤝 Contribution

Ce projet est personnel mais les suggestions sont bienvenues !

## 📄 Licence

Projet personnel - Tous droits réservés

## 📞 Support

Pour toute question :
- Consultez [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- Vérifiez les logs de la console (F12)
- Consultez la console Firebase

---

**Développé avec ❤️ par Mathieu & Assia**
