import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '../../src/lib/db';
import { verifyToken } from '../../src/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set proper JSON content type
    res.setHeader('Content-Type', 'application/json');

    // Handle GET method (list all categories)
    if (req.method === 'GET') {
      const db = await getDB();
      const categories = await db.all('SELECT * FROM categories ORDER BY name ASC');
      return res.status(200).json(categories);
    }

    // For all other methods, verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      await verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Handle POST method (create)
    if (req.method === 'POST') {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }

      const db = await getDB();
      
      // Check if category already exists
      const existing = await db.get('SELECT * FROM categories WHERE name = ?', [name]);
      if (existing) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      const result = await db.run(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description || '']
      );

      const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);
      return res.status(201).json(newCategory);
    }

    // Handle PUT method (update)
    if (req.method === 'PUT' && req.query.id) {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }

      const db = await getDB();
      
      // Check if category exists
      const existing = await db.get('SELECT * FROM categories WHERE id = ?', [req.query.id]);
      if (!existing) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Check if new name conflicts with another category
      const nameConflict = await db.get(
        'SELECT * FROM categories WHERE name = ? AND id != ?', 
        [name, req.query.id]
      );
      if (nameConflict) {
        return res.status(400).json({ message: 'Category name already exists' });
      }

      await db.run(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [name, description || '', req.query.id]
      );

      const updatedCategory = await db.get('SELECT * FROM categories WHERE id = ?', [req.query.id]);
      return res.status(200).json(updatedCategory);
    }

    // Handle DELETE method
    if (req.method === 'DELETE' && req.query.id) {
      const db = await getDB();
      
      // Check if category exists
      const category = await db.get('SELECT * FROM categories WHERE id = ?', [req.query.id]);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Check if category is in use
      const productsUsingCategory = await db.get(
        'SELECT COUNT(*) as count FROM products WHERE category = ?',
        [category.name]
      );

      if (productsUsingCategory.count > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete category that is being used by products'
        });
      }

      await db.run('DELETE FROM categories WHERE id = ?', [req.query.id]);
      return res.status(200).json({ message: 'Category deleted successfully' });
    }

    // Handle unsupported methods
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Categories API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 