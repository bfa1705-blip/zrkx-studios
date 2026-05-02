import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'zrkx_studios';

async function initDatabase() {
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  console.log('🔄 Initialisation de la base de données MongoDB...');

  // Créer les collections
  const collections = ['users', 'categories', 'leaks', 'comments'];
  
  for (const collectionName of collections) {
    const exists = await db.listCollections({ name: collectionName }).hasNext();
    if (!exists) {
      await db.createCollection(collectionName);
      console.log(`✅ Collection "${collectionName}" créée`);
    }
  }

  // Créer les index
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  console.log('✅ Index users créés');

  await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
  console.log('✅ Index categories créés');

  await db.collection('leaks').createIndex({ userId: 1 });
  await db.collection('leaks').createIndex({ categoryId: 1 });
  await db.collection('leaks').createIndex({ createdAt: -1 });
  console.log('✅ Index leaks créés');

  await db.collection('comments').createIndex({ leakId: 1 });
  await db.collection('comments').createIndex({ userId: 1 });
  console.log('✅ Index comments créés');

  // Insérer les catégories par défaut
  const categoriesCount = await db.collection('categories').countDocuments();
  if (categoriesCount === 0) {
    await db.collection('categories').insertMany([
      { name: 'Base', slug: 'base' },
      { name: 'Script', slug: 'script' },
      { name: 'Vêtement', slug: 'vetement' },
      { name: 'Véhicule', slug: 'vehicule' },
      { name: 'Weapon', slug: 'weapon' }
    ]);
    console.log('✅ Catégories par défaut insérées');
  }

  console.log('✨ Base de données initialisée avec succès !');
  
  await client.close();
}

initDatabase().catch(console.error);
