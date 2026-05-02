# Zrkx Studios - Next.js + MongoDB

## Installation

1. **Installer MongoDB** :
   - Téléchargez et installez MongoDB : https://www.mongodb.com/try/download/community
   - Ou utilisez MongoDB Atlas (cloud) : https://www.mongodb.com/cloud/atlas

2. **Installer les dépendances** :
```bash
npm install
```

3. **Initialiser la base de données** :
```bash
npx ts-node scripts/init-mongodb.ts
```

4. **Configurer les variables d'environnement** :
   - Copiez `.env.local` et modifiez les valeurs selon votre configuration
   - Changez `MONGODB_URI` si vous utilisez MongoDB Atlas
   - Changez `JWT_SECRET` pour la production

5. **Lancer le serveur de développement** :
```bash
npm run dev
```

6. **Ouvrir le navigateur** :
```
http://localhost:3000
```

## Structure du projet

```
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Authentification
│   │   ├── leaks/        # Gestion des leaks
│   │   └── comments/     # Gestion des commentaires
│   ├── home/             # Page d'accueil
│   ├── login/            # Page de connexion
│   ├── register/         # Page d'inscription
│   ├── leak/[id]/        # Page de détails d'un leak
│   ├── add-leak/         # Page d'ajout de leak
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Page racine (redirection)
│   └── globals.css       # Styles globaux
├── lib/
│   ├── db.ts             # Configuration MongoDB
│   ├── auth.ts           # Gestion JWT
│   ├── models.ts         # Types TypeScript
│   └── translations.ts   # Traductions
├── scripts/
│   └── init-mongodb.ts   # Script d'initialisation DB
├── components/           # Composants réutilisables
├── .env.local            # Variables d'environnement
├── next.config.js        # Configuration Next.js
├── package.json          # Dépendances
└── tsconfig.json         # Configuration TypeScript
```

## Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **MongoDB** - Base de données NoSQL
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **Axios** - Requêtes HTTP
- **React Icons** - Icônes

## Collections MongoDB

### users
```typescript
{
  _id: ObjectId,
  username: string,
  email: string,
  password: string (hashed),
  language: 'fr' | 'en',
  createdAt: Date
}
```

### categories
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string
}
```

### leaks
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  categoryId: ObjectId,
  title: string,
  message: string,
  link: string,
  image?: string,
  views: number,
  downloads: number,
  createdAt: Date
}
```

### comments
```typescript
{
  _id: ObjectId,
  leakId: ObjectId,
  userId: ObjectId,
  rating: number (1-5),
  comment: string,
  createdAt: Date
}
```

## Fonctionnalités

✅ Authentification (Login/Register)
✅ Système multilingue (FR/EN)
✅ Publication de leaks avec images
✅ Commentaires avec notation (1-5 étoiles)
✅ Compteur de vues et téléchargements
✅ Filtrage par catégorie
✅ Recherche de leaks
✅ Interface responsive
✅ Thème sombre élégant

## Production

Pour déployer en production :

```bash
npm run build
npm start
```

## MongoDB Atlas (Cloud)

Pour utiliser MongoDB Atlas :

1. Créez un compte sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit
3. Obtenez votre URI de connexion
4. Modifiez `.env.local` :
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

## Notes importantes

- Changez `JWT_SECRET` dans `.env.local` pour la production
- Configurez HTTPS en production
- Utilisez MongoDB Atlas pour la production
- Activez les CORS si nécessaire
