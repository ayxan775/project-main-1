import type { NextApiRequest, NextApiResponse } from 'next';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import querystring from 'querystring';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const oauthClientId = process.env.OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
  const oauthTenantId = process.env.OAUTH_TENANT_ID;
  const oauthUserEmail = process.env.OAUTH_USER_EMAIL;
  const receiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL;
  
  if (!oauthClientId || !oauthClientSecret || !oauthTenantId || !oauthUserEmail || !receiverEmail) {
    return res.status(500).json({ 
      error: 'Configuration error', 
      details: 'Email credentials not properly configured' 
    });
  }
  
  let accessToken = '';
  
  try {
    console.log('Attempting to fetch OAuth2 access token for test email...');
    const tokenUrl = `https://login.microsoftonline.com/${oauthTenantId}/oauth2/v2.0/token`;
    const tokenRequestBody = {
      client_id: oauthClientId,
      client_secret: oauthClientSecret,
      scope: 'https://outlook.office.com/.default',
      grant_type: 'client_credentials',
    };

    const tokenResponse = await axios.post(
      tokenUrl,
      querystring.stringify(tokenRequestBody),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = tokenResponse.data.access_token;
    console.log('Successfully fetched OAuth2 access token for test email.');
    
    console.log('Creating test email transporter with OAuth2...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: oauthUserEmail,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        accessToken: accessToken,
      },
      debug: true,
      logger: true
    });
    
    console.log('Sending test email with OAuth2...');
    await transporter.sendMail({
      from: oauthUserEmail,
      to: receiverEmail,
      subject: 'Test Email from App',
      text: 'This is a test email sent from the application to verify email functionality.',
      html: '<p>This is a test email sent from the application to verify email functionality.</p>'
    });
    
    console.log('Test email sent successfully!');
    return res.status(200).json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({ 
      error: 'Failed to send test email', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
} 