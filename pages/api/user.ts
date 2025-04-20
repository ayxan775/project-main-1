import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
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
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      await initializeDB();
      dbInitialized = true;
    }

    // All methods require authentication
    try {
      await verifyToken(req);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Handle PUT method (update password)
    if (req.method === 'PUT') {
      const { username, currentPassword, newPassword } = req.body;
      
      if (!username || !currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: 'Username, current password, and new password are required' 
        });
      }
      
      const db = await getDB();
      const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.run(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, username]
      );
      
      return res.status(200).json({ message: 'Password updated successfully' });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('User API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 