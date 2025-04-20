import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const catalogInfoPath = path.join(process.cwd(), 'public', 'catalog-info.json');
    
    if (!fs.existsSync(catalogInfoPath)) {
      return res.status(200).json({ catalog: null });
    }

    const catalogInfoContent = fs.readFileSync(catalogInfoPath, 'utf8');
    const catalogInfo = JSON.parse(catalogInfoContent);
    const catalogPath = path.join(process.cwd(), 'public', catalogInfo.path);

    if (!fs.existsSync(catalogPath)) {
      return res.status(200).json({ catalog: null });
    }

    // Read the catalog file and convert to base64
    const catalogBuffer = fs.readFileSync(catalogPath);
    const base64Catalog = `data:application/pdf;base64,${catalogBuffer.toString('base64')}`;

    res.status(200).json({
      catalog: base64Catalog,
      lastUpdated: catalogInfo.lastUpdated,
      fileName: catalogInfo.fileName
    });
  } catch (error) {
    console.error('Error getting catalog status:', error);
    res.status(500).json({ message: 'Error getting catalog status' });
  }
} 