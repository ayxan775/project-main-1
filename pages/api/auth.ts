import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB, initializeDB } from '../../src/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize DB flag
let dbInitialized = false;

// In-memory store for failed login attempts and blocked IPs
interface FailedAttempt {
  count: number;
  lastAttempt: number;
}
const failedLoginAttempts: Record<string, FailedAttempt> = {};
const blockedIPs: Record<string, number> = {}; // Stores IP -> blockedUntil timestamp

const MAX_FAILED_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // Reset attempts if no new attempt in 5 mins

function getClientIp(req: NextApiRequest): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0].trim();
  }
  const xRealIp = req.headers['x-real-ip'];
  if (typeof xRealIp === 'string') {
    return xRealIp.trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set proper JSON content type
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const clientIp = getClientIp(req);

  // Check if IP is blocked
  if (blockedIPs[clientIp] && blockedIPs[clientIp] > Date.now()) {
    const timeLeft = Math.ceil((blockedIPs[clientIp] - Date.now()) / 1000 / 60);
    return res.status(429).json({ message: `Too many failed login attempts. Please try again in ${timeLeft} minutes.` });
  } else if (blockedIPs[clientIp] && blockedIPs[clientIp] <= Date.now()) {
    delete blockedIPs[clientIp]; // Unblock if time has passed
    delete failedLoginAttempts[clientIp]; // Also clear attempts
  }

  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      try {
        await initializeDB();
        dbInitialized = true;
        console.log('DB initialized in auth API');
      } catch (dbError) {
        console.error('Failed to initialize database:', dbError);
        return res.status(500).json({
          message: 'Database initialization failed',
          error: dbError instanceof Error ? dbError.message : String(dbError)
        });
      }
    }
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const db = await getDB();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      // Generic message for non-existent user or wrong password to prevent username enumeration
      // Increment failed attempts
      failedLoginAttempts[clientIp] = failedLoginAttempts[clientIp] || { count: 0, lastAttempt: 0 };
      if (Date.now() - failedLoginAttempts[clientIp].lastAttempt > ATTEMPT_WINDOW_MS) {
        failedLoginAttempts[clientIp].count = 1; // Reset count if window expired
      } else {
        failedLoginAttempts[clientIp].count++;
      }
      failedLoginAttempts[clientIp].lastAttempt = Date.now();

      if (failedLoginAttempts[clientIp].count >= MAX_FAILED_ATTEMPTS) {
        blockedIPs[clientIp] = Date.now() + BLOCK_DURATION_MS;
        const timeLeft = Math.ceil(BLOCK_DURATION_MS / 1000 / 60);
        return res.status(429).json({ message: `Too many failed login attempts. Please try again in ${timeLeft} minutes.` });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment failed attempts
      failedLoginAttempts[clientIp] = failedLoginAttempts[clientIp] || { count: 0, lastAttempt: 0 };
       if (Date.now() - failedLoginAttempts[clientIp].lastAttempt > ATTEMPT_WINDOW_MS) {
        failedLoginAttempts[clientIp].count = 1; // Reset count if window expired
      } else {
        failedLoginAttempts[clientIp].count++;
      }
      failedLoginAttempts[clientIp].lastAttempt = Date.now();

      if (failedLoginAttempts[clientIp].count >= MAX_FAILED_ATTEMPTS) {
        blockedIPs[clientIp] = Date.now() + BLOCK_DURATION_MS;
        const timeLeft = Math.ceil(BLOCK_DURATION_MS / 1000 / 60);
        return res.status(429).json({ message: `Too many failed login attempts. Please try again in ${timeLeft} minutes.` });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If login is successful, reset failed attempts for this IP
    if (failedLoginAttempts[clientIp]) {
      delete failedLoginAttempts[clientIp];
    }
    if (blockedIPs[clientIp]) { // Should not happen if already checked, but good for safety
        delete blockedIPs[clientIp];
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 