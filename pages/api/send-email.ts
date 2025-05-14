import type { NextApiRequest, NextApiResponse } from 'next';
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
        scope: 'https://graph.microsoft.com/.default',
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
        scope: 'https://graph.microsoft.com/.default',
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
      console.log('Sending email using Microsoft Graph API...');
      
      const graphEndpoint = 'https://graph.microsoft.com/v1.0/users/' + oauthUserEmail + '/sendMail';
      
      const emailBody = {
        message: {
          subject: `Contact Form: ${subject}`,
          body: {
            contentType: 'HTML',
            content: `
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
            `
          },
          toRecipients: [
            {
              emailAddress: {
                address: contactFormReceiverEmail
              }
            }
          ],
          replyTo: [
            {
              emailAddress: {
                address: email,
                name: name
              }
            }
          ]
        },
        saveToSentItems: false
      };
      
      await axios.post(graphEndpoint, emailBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Email sent successfully with Microsoft Graph API.');
      return res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (mailError: any) { 
      console.error('--- Full Error Object Start (Graph API Email) ---');
      console.error(mailError); 
      console.error('--- Full Error Object End (Graph API Email) ---');

      let detailedErrorMessage = 'Unknown error during email sending with Graph API.';
      if (mailError.response) {
        console.error('Graph API Response Status:', mailError.response.status);
        console.error('Graph API Response Data:', JSON.stringify(mailError.response.data, null, 2));
        detailedErrorMessage = `Graph API Error: ${mailError.response.status} - ${JSON.stringify(mailError.response.data)}`;
      } else if (mailError instanceof Error) { 
        detailedErrorMessage = mailError.message;
      } else if (typeof mailError === 'string') {
        detailedErrorMessage = mailError;
      }
      
      return res.status(500).json({ error: 'Failed to send email.', details: detailedErrorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}