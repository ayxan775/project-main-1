import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '../../../src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDB();
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'Job opening ID is required' });
    }
    
    // GET - Retrieve a specific job opening
    if (req.method === 'GET') {
      const job = await db.get('SELECT * FROM job_openings WHERE id = ?', [id]);
      
      if (!job) {
        return res.status(404).json({ message: 'Job opening not found' });
      }
      
      return res.status(200).json(job);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling job opening:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 