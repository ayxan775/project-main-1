import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDB } from '../../src/lib/db';

// This API route will initialize the database
// It should be called when the server starts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDB();
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Failed to initialize database', error: String(error) });
  }
} 