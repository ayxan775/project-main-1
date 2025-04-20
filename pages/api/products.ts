import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getDB, initializeDB } from '../../src/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize DB flag
let dbInitialized = false;

// Middleware to verify JWT token
const verifyToken = (req: NextApiRequest): Promise<any> => {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reject(new Error('Unauthorized'));
      return;
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(new Error('Unauthorized'));
        return;
      }
      resolve(decoded);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      try {
        await initializeDB();
        dbInitialized = true;
        console.log('DB initialized in products API');
      } catch (dbError) {
        console.error('Failed to initialize database:', dbError);
        return res.status(500).json({ 
          message: 'Database initialization failed',
          error: dbError instanceof Error ? dbError.message : String(dbError)
        });
      }
    }
    
    // Handle GET method without authentication for public product listing
    if (req.method === 'GET' && !req.query.id) {
      const db = await getDB();
      const products = await db.all('SELECT * FROM products');
      
      // Parse JSON strings back to arrays
      const formattedProducts = products.map((product: any) => ({
        ...product,
        specs: JSON.parse(product.specs || '[]'),
        useCases: JSON.parse(product.useCases || '[]'),
        images: JSON.parse(product.images || '[]')
      }));
      
      return res.status(200).json(formattedProducts);
    }
    
    // Handle GET method for a single product
    if (req.method === 'GET' && req.query.id) {
      const db = await getDB();
      const product = await db.get('SELECT * FROM products WHERE id = ?', [req.query.id]);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Parse JSON strings back to arrays
      const formattedProduct = {
        ...product,
        specs: JSON.parse(product.specs || '[]'),
        useCases: JSON.parse(product.useCases || '[]'),
        images: JSON.parse(product.images || '[]')
      };
      
      return res.status(200).json(formattedProduct);
    }
    
    // All other methods require authentication
    try {
      await verifyToken(req);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Handle POST method (create)
    if (req.method === 'POST') {
      const { name, description, image, specs, useCases, category, images } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Product name is required' });
      }
      
      const db = await getDB();
      const result = await db.run(
        'INSERT INTO products (name, description, image, specs, useCases, category, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          description || '',
          image || '',
          JSON.stringify(specs || []),
          JSON.stringify(useCases || []),
          category || '',
          JSON.stringify(images || [])
        ]
      );
      
      const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
      
      return res.status(201).json({
        ...newProduct,
        specs: JSON.parse(newProduct.specs || '[]'),
        useCases: JSON.parse(newProduct.useCases || '[]'),
        images: JSON.parse(newProduct.images || '[]')
      });
    }
    
    // Handle PUT method (update)
    if (req.method === 'PUT' && req.query.id) {
      const { name, description, image, specs, useCases, category, images } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Product name is required' });
      }
      
      const db = await getDB();
      await db.run(
        'UPDATE products SET name = ?, description = ?, image = ?, specs = ?, useCases = ?, category = ?, images = ? WHERE id = ?',
        [
          name,
          description || '',
          image || '',
          JSON.stringify(specs || []),
          JSON.stringify(useCases || []),
          category || '',
          JSON.stringify(images || []),
          req.query.id
        ]
      );
      
      const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [req.query.id]);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      return res.status(200).json({
        ...updatedProduct,
        specs: JSON.parse(updatedProduct.specs || '[]'),
        useCases: JSON.parse(updatedProduct.useCases || '[]'),
        images: JSON.parse(updatedProduct.images || '[]')
      });
    }
    
    // Handle DELETE method
    if (req.method === 'DELETE' && req.query.id) {
      const db = await getDB();
      const product = await db.get('SELECT * FROM products WHERE id = ?', [req.query.id]);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      await db.run('DELETE FROM products WHERE id = ?', [req.query.id]);
      
      return res.status(200).json({ message: 'Product deleted successfully' });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 