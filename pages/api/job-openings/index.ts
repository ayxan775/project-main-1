import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '../../../src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDB();
    
    // GET - Retrieve all job openings
    if (req.method === 'GET') {
      const activeOnly = req.query.active === 'true';
      
      // Log for debugging
      console.log('GET /api/job-openings - activeOnly:', activeOnly);
      console.log('Query parameters:', req.query);
      
      let query = 'SELECT * FROM job_openings';
      if (activeOnly) {
        query += ' WHERE active = 1';
      }
      query += ' ORDER BY created_at DESC';
      
      console.log('Executing SQL:', query);
      
      try {
        const jobs = await db.all(query);
        
        // Log the results for debugging
        console.log(`Found ${jobs.length} job openings:`, jobs);
        
        return res.status(200).json(jobs);
      } catch (dbError: any) {
        console.error('Database query error:', dbError);
        return res.status(500).json({ message: 'Database query failed', error: dbError.message });
      }
    }
    
    // POST - Create a new job opening (protected route)
    if (req.method === 'POST') {
      // Check for auth token here (reusing the auth middleware pattern)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { title, department, location, type, description } = req.body;
      
      if (!title || !location || !type || !description) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }
      
      // Include the active status, default to true if not provided
      const active = req.body.active !== undefined ? req.body.active : true;
      
      const result = await db.run(
        'INSERT INTO job_openings (title, department, location, type, description, active) VALUES (?, ?, ?, ?, ?, ?)',
        [title, department || 'general', location, type, description, active ? 1 : 0]
      );
      
      return res.status(201).json({ 
        id: result.lastID,
        message: 'Job opening created successfully' 
      });
    }
    
    // PUT - Update a job opening (protected route)
    if (req.method === 'PUT') {
      // Check for auth token here
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { id, title, department, location, type, description, active } = req.body;
      
      if (!id || !title || !location || !type || !description) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }
      
      // Convert active to integer for SQLite
      const activeValue = active ? 1 : 0;
      
      console.log('Updating job opening:', { id, title, department, location, type, description, active, activeValue });
      
      await db.run(
        'UPDATE job_openings SET title = ?, department = ?, location = ?, type = ?, description = ?, active = ? WHERE id = ?',
        [title, department || 'general', location, type, description, activeValue, id]
      );
      
      return res.status(200).json({ message: 'Job opening updated successfully' });
    }
    
    // DELETE - Remove a job opening (protected route)
    if (req.method === 'DELETE') {
      // Check for auth token here
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ message: 'Job opening ID is required' });
      }
      
      await db.run('DELETE FROM job_openings WHERE id = ?', [id]);
      
      return res.status(200).json({ message: 'Job opening deleted successfully' });
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling job openings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 