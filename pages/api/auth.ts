import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB, initializeDB } from '../../src/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize DB flag
let dbInitialized = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      try {
        await initializeDB();
        dbInitialized = true;
        console.log('DB initialized in auth API');
      } catch (dbError) {
        console.error('Failed to initialize database:', dbError);
        return res.status(500).json({ 
          message: 'Database initialization failed',
          error: dbError instanceof Error ? dbError.message : String(dbError)
        });
      }
    }
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const db = await getDB();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 