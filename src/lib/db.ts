// Check if we're running on the server to avoid errors in the browser
const isServer = typeof window === 'undefined';

// Type for database instance
type DBInstance = any;

// Initialize database
export async function initializeDB() {
  if (!isServer) {
    throw new Error('Database operations can only be performed on the server');
  }

  try {
    // Dynamic imports to avoid issues with client-side code
    const { open } = await import('sqlite');
    const sqlite3 = await import('sqlite3');
    const bcrypt = await import('bcryptjs');
    const path = await import('path');
    const url = await import('url');
    const fs = await import('fs');

    // Setup paths
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const DB_PATH = path.join(process.cwd(), 'data.db');

    console.log('Initializing database at:', DB_PATH);
    
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.default.Database
    });
    
    console.log('Connected to database');
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        specs TEXT,
        useCases TEXT,
        category TEXT,
        images TEXT,
        document TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category) REFERENCES categories(name)
      );
    `);
    
    console.log('Database tables created');

    // Alter existing products table to add document column if it doesn't exist
    try {
      // Check if the document column exists
      const tableInfo = await db.all('PRAGMA table_info(products)');
      const documentColumnExists = tableInfo.some((column: any) => column.name === 'document');
      
      if (!documentColumnExists) {
        // Add document column to products table
        await db.exec('ALTER TABLE products ADD COLUMN document TEXT');
        console.log('Added document column to products table');
      }
    } catch (error) {
      console.error('Error altering products table:', error);
    }

    // Check if admin user exists, if not create it
    const adminUser = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('Azerbaycan123', 10);
      await db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('Admin user created');
    }

    // Initialize default categories if none exist
    const categoriesCount = await db.get('SELECT COUNT(*) as count FROM categories');
    if (categoriesCount.count === 0) {
      const defaultCategories = [
        { name: 'Industrial Equipment', description: 'Heavy-duty industrial machinery and equipment' },
        { name: 'Safety Gear', description: 'Personal protective equipment and safety solutions' },
        { name: 'Measurement Tools', description: 'Precision measurement and testing instruments' },
        { name: 'Fluid Control', description: 'Valves, pumps, and fluid management systems' },
        { name: 'Power Systems', description: 'Power generation and electrical equipment' },
        { name: 'Construction Equipment', description: 'Tools and equipment for construction projects' }
      ];

      for (const category of defaultCategories) {
        await db.run(
          'INSERT INTO categories (name, description) VALUES (?, ?)',
          [category.name, category.description]
        );
      }
    }

    // Import initial products data if table is empty
    const productsCount = await db.get('SELECT COUNT(*) as count FROM products');
    
    if (productsCount.count === 0) {
      try {
        // Try to load products from JSON file
        const fs = await import('fs');
        const path = await import('path');
        const productsJsonPath = path.join(process.cwd(), 'src', 'data', 'products.json');
        
        let products = [];
        
        if (fs.existsSync(productsJsonPath)) {
          // Read JSON file
          const productsJson = fs.readFileSync(productsJsonPath, 'utf8');
          products = JSON.parse(productsJson);
          console.log('Loaded products from JSON file');
        } else {
          // Fallback to default product
          products = [{
            id: 1,
            name: "Sample Product",
            description: "A sample product created automatically",
            image: "https://placehold.co/600x400?text=Sample+Product",
            specs: ["Sample specification 1", "Sample specification 2"],
            useCases: ["Sample use case 1", "Sample use case 2"],
            category: "Sample Category"
          }];
          console.log('Using default product as fallback');
        }
        
        // Insert products
        for (const product of products) {
          await db.run(
            'INSERT INTO products (id, name, description, image, specs, useCases, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              product.id,
              product.name,
              product.description,
              product.image,
              JSON.stringify(product.specs),
              JSON.stringify(product.useCases),
              product.category
            ]
          );
        }
        console.log(`${products.length} products inserted into database`);
      } catch (error) {
        console.error('Error importing initial products:', error);
      }
    }

    // Store the db instance in module state
    dbInstance = db;
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Get database instance
let dbInstance: DBInstance = null;

export async function getDB() {
  if (!isServer) {
    throw new Error('Database operations can only be performed on the server');
  }
  
  if (!dbInstance) {
    dbInstance = await initializeDB();
  }
  return dbInstance;
}

// Close database connection
export async function closeDB() {
  if (!isServer) {
    throw new Error('Database operations can only be performed on the server');
  }
  
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
} 