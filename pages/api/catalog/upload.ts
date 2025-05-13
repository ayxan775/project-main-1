import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb', // Increase size limit to 25MB
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { catalog } = req.body;

    if (!catalog) {
      return res.status(400).json({ message: 'No catalog provided' });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Extract the base64 data
    const base64Data = catalog.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    // Save the file
    const filePath = path.join(uploadsDir, 'catalog.pdf');
    fs.writeFileSync(filePath, buffer);

    // Save catalog info to a JSON file
    const catalogInfo = {
      lastUpdated: new Date().toISOString(),
      fileName: 'catalog.pdf',
      path: '/uploads/catalog.pdf'
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'public', 'catalog-info.json'),
      JSON.stringify(catalogInfo)
    );

    res.status(200).json({ message: 'Catalog uploaded successfully', path: '/uploads/catalog.pdf' });
  } catch (error) {
    console.error('Error uploading catalog:', error);
    res.status(500).json({ message: 'Error uploading catalog' });
  }
} 