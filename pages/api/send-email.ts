import type { NextApiRequest, NextApiResponse } from 'next';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import querystring from 'querystring';

interface EmailRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface OAuthTokenResponse {
  token_type: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body as EmailRequestBody;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const oauthClientId = process.env.OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
    const oauthTenantId = process.env.OAUTH_TENANT_ID;
    const oauthUserEmail = process.env.OAUTH_USER_EMAIL; 
    const contactFormReceiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL;

    if (!oauthClientId || !oauthClientSecret || !oauthTenantId || !oauthUserEmail || !contactFormReceiverEmail) {
      console.error('Email configuration environment variables are not fully set.');
      return res.status(500).json({ error: 'Server configuration error for email.', details: 'Required email environment variables missing.' });
    }

    let accessToken = '';

    try {
      console.log('Attempting to fetch OAuth2 access token...');
      const tokenUrl = `https://login.microsoftonline.com/${oauthTenantId}/oauth2/v2.0/token`;
      const tokenRequestBody = {
        client_id: oauthClientId,
        client_secret: oauthClientSecret,
        scope: 'https://outlook.office.com/.default',
        grant_type: 'client_credentials',
      };

      const tokenResponse = await axios.post<OAuthTokenResponse>(
        tokenUrl,
        querystring.stringify(tokenRequestBody),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new Error('Access token not found in Microsoft token response.');
      }
      console.log('Successfully fetched OAuth2 access token.');

    } catch (tokenError: any) {
      console.error('--- Error Fetching OAuth2 Token ---');
      console.error('Request URL:', `https://login.microsoftonline.com/${oauthTenantId}/oauth2/v2.0/token`);
      console.error('Request Body Sent (client_secret redacted):', {
        client_id: oauthClientId,
        client_secret: '[REDACTED]',
        scope: 'https://outlook.office.com/.default',
        grant_type: 'client_credentials',
      });
      if (tokenError.response) {
        console.error('Response Status:', tokenError.response.status);
        console.error('Response Headers:', JSON.stringify(tokenError.response.headers, null, 2));
        console.error('Response Data:', JSON.stringify(tokenError.response.data, null, 2));
        const errorDesc = tokenError.response.data?.error_description || 'No error_description from token endpoint.';
        return res.status(500).json({ error: 'Failed to obtain OAuth2 access token.', details: errorDesc });
      } else if (tokenError.request) {
        console.error('No response received for token request:', tokenError.request);
        return res.status(500).json({ error: 'Failed to obtain OAuth2 access token.', details: 'No response from token server.' });
      } else {
        console.error('Error setting up token request:', tokenError.message);
        return res.status(500).json({ error: 'Failed to obtain OAuth2 access token.', details: tokenError.message });
      }
    }
    
    try {
      console.log('Initializing Nodemailer transporter with OAuth2 token...');
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

      const mailOptions = {
        from: `"${name}" <${oauthUserEmail}>`,
        replyTo: email,
        to: contactFormReceiverEmail,
        subject: `Contact Form: ${subject}`,
        text: `You have a new message from ${name} (${email}):\n\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.9em; color: #777;">This email was sent from the contact form on your website.</p>
          </div>
        `,
      };

      console.log('Attempting to send email with OAuth2 token...');
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully with OAuth2 token.');
      return res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (mailError: any) { 
      console.error('--- Full Error Object Start (Mail Sending with OAuth2) ---');
      console.error(mailError); 
      console.error('--- Full Error Object End (Mail Sending with OAuth2) ---');

      let detailedErrorMessage = 'Unknown error during email sending after obtaining token.';
      if (mailError instanceof Error) { 
        detailedErrorMessage = mailError.message;
      } else if (typeof mailError === 'string') {
        detailedErrorMessage = mailError;
      }
      
      if (mailError.code) {
        console.error('Nodemailer Mail Error Code:', mailError.code);
        detailedErrorMessage += ` | Nodemailer Code: ${mailError.code}`;
      }
      if (mailError.responseBody) {
        console.error('Mail Error Response Body:', mailError.responseBody);
        detailedErrorMessage += ` | Mail Error Response Body: ${mailError.responseBody}`;
      }
      if (mailError.stack) {
        console.error('Mail Error Stack:', mailError.stack);
      }
      return res.status(500).json({ error: 'Failed to send email.', details: detailedErrorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}