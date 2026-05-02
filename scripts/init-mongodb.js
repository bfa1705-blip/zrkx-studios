const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'zrkx_studios';

async function initDatabase() {
  try {
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
      } else {
        console.log(`ℹ️  Collection "${collectionName}" existe déjà`);
      }
    }

    // Créer les index
    try {
      await db.collection('users').createIndex({ username: 1 }, { unique: true });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Index users créés');
    } catch (e) {
      console.log('ℹ️  Index users existent déjà');
    }

    try {
      await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
      console.log('✅ Index categories créés');
    } catch (e) {
      console.log('ℹ️  Index categories existent déjà');
    }

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
        { name: 'Weapon', slug: 'weapon' },
        { name: 'Vêtement', slug: 'vetement' }
      ]);
      console.log('✅ Catégories par défaut insérées:');
      console.log('   - Base');
      console.log('   - Script');
      console.log('   - Weapon');
      console.log('   - Vêtement');
    } else {
      console.log(`ℹ️  ${categoriesCount} catégories existent déjà`);
    }

    console.log('\n✨ Base de données initialisée avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Démarrez le serveur: npm run dev');
    console.log('   2. Ouvrez http://localhost:3000');
    console.log('   3. Créez un compte et commencez à publier des leaks!\n');
    
    await client.close();
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    process.exit(1);
  }
}

initDatabase();
