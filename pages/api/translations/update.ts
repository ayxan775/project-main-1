import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../src/lib/auth'; // Assuming you have a token verification utility

// Define a type for the translation structure
type TranslationObject = { [key: string]: string | TranslationObject };

interface UpdateRequestBody {
  en: TranslationObject;
  az: TranslationObject;
  ru: TranslationObject;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyToken(token); // Verify the admin token
    if (!decoded) { // Or check for specific roles/permissions if you have them
      return res.status(403).json({ message: 'Forbidden: Invalid token or insufficient permissions' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }

  try {
    const { en, az, ru } = req.body as UpdateRequestBody;

    if (!en || !az || !ru || typeof en !== 'object' || typeof az !== 'object' || typeof ru !== 'object') {
      return res.status(400).json({ message: 'Invalid or incomplete translation data provided.' });
    }

    const localesDir = path.resolve(process.cwd(), 'locales');
    const enFilePath = path.join(localesDir, 'en.json');
    const azFilePath = path.join(localesDir, 'az.json');
    const ruFilePath = path.join(localesDir, 'ru.json');

    // Write English translations
    fs.writeFileSync(enFilePath, JSON.stringify(en, null, 2), 'utf8');

    // Write Azerbaijani translations
    fs.writeFileSync(azFilePath, JSON.stringify(az, null, 2), 'utf8');

    // Write Russian translations
    fs.writeFileSync(ruFilePath, JSON.stringify(ru, null, 2), 'utf8');

    res.status(200).json({ message: 'Translations updated successfully!' });
  } catch (error) {
   const err = error as Error;
   console.error('Error updating translations:', err);
   console.error('Error name:', err.name);
   console.error('Error message:', err.message);
   console.error('Error stack:', err.stack);
   res.status(500).json({ message: 'Failed to update translations.', errorName: err.name, errorMessage: err.message, errorStack: err.stack });
  }
}