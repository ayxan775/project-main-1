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
      return res.status(404).json({ message: 'No catalog available' });
    }

    // Read the catalog info file and parse it
    const catalogInfoContent = fs.readFileSync(catalogInfoPath, 'utf8');
    const catalogInfo = JSON.parse(catalogInfoContent);
    const catalogPath = path.join(process.cwd(), 'public', catalogInfo.path);

    if (!fs.existsSync(catalogPath)) {
      return res.status(404).json({ message: 'Catalog file not found' });
    }

    // Generate a timestamp-based filename to avoid browser caching
    const timestamp = new Date().getTime();
    const filenameParts = catalogInfo.fileName.split('.');
    const extension = filenameParts.pop();
    const filenameBase = filenameParts.join('.');
    const downloadFilename = `${filenameBase}_${timestamp}.${extension}`;

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(catalogPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading catalog:', error);
    res.status(500).json({ message: 'Error downloading catalog' });
  }
} 