import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const catalogInfoPath = path.join(process.cwd(), 'public', 'catalog-info.json');
    
    // Check if catalog info exists
    if (fs.existsSync(catalogInfoPath)) {
      const catalogInfo = JSON.parse(fs.readFileSync(catalogInfoPath, 'utf8'));
      const catalogPath = path.join(process.cwd(), 'public', catalogInfo.path);
      
      // Delete the catalog file if it exists
      if (fs.existsSync(catalogPath)) {
        fs.unlinkSync(catalogPath);
      }
      
      // Delete the catalog info file
      fs.unlinkSync(catalogInfoPath);
    }

    res.status(200).json({ message: 'Catalog deleted successfully' });
  } catch (error) {
    console.error('Error deleting catalog:', error);
    res.status(500).json({ message: 'Error deleting catalog' });
  }
} 