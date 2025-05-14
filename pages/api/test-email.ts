import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import querystring from 'querystring';
import * as formidable from 'formidable';
import fs from 'fs';
import { IncomingForm } from 'formidable';

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
const parseForm = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });
    
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  try {
    // Parse form data instead of body
    const { fields, files } = await parseForm(req);
    
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
    
    // Check if a test file was uploaded
    let attachment;
    if (files.testFile && Array.isArray(files.testFile) && files.testFile[0]) {
      const file = files.testFile[0];
      
      // Verify file size
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
      }
      
      // Read the file and convert to base64
      const fileContent = fs.readFileSync(file.filepath);
      const base64Content = fileContent.toString('base64');
      
      attachment = {
        fileName: file.originalFilename || 'test-attachment',
        content: base64Content,
        contentType: file.mimetype || 'application/octet-stream',
      };
    }
    
    let accessToken = '';
    
    try {
      console.log('Attempting to fetch OAuth2 access token for test email...');
      const tokenUrl = `https://login.microsoftonline.com/${oauthTenantId}/oauth2/v2.0/token`;
      const tokenRequestBody = {
        client_id: oauthClientId,
        client_secret: oauthClientSecret,
        scope: 'https://graph.microsoft.com/.default',
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
      
      console.log('Sending test email via Microsoft Graph API...');
      
      const graphEndpoint = 'https://graph.microsoft.com/v1.0/users/' + oauthUserEmail + '/sendMail';
      
      const emailBody: any = {
        message: {
          subject: 'Test Email from App',
          body: {
            contentType: 'HTML',
            content: '<p>This is a test email sent from the application to verify email functionality.</p>'
          },
          toRecipients: [
            {
              emailAddress: {
                address: receiverEmail
              }
            }
          ]
        },
        saveToSentItems: false
      };
      
      // Add the attachment if present
      if (attachment) {
        emailBody.message.attachments = [
          {
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: attachment.fileName,
            contentType: attachment.contentType,
            contentBytes: attachment.content
          }
        ];
        console.log('Adding attachment to test email:', attachment.fileName);
      }
      
      await axios.post(graphEndpoint, emailBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Test email sent successfully via Graph API!');
      return res.status(200).json({ success: true, message: 'Test email sent!' });
    } catch (error: any) {
      console.error('Test email error:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(error);
      }
      
      return res.status(500).json({ 
        error: 'Failed to send test email', 
        details: error.response ? 
          `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}` : 
          (error instanceof Error ? error.message : String(error))
      });
    }
  } catch (parseError) {
    console.error('Form parsing error:', parseError);
    return res.status(500).json({ 
      error: 'Failed to process form data', 
      details: parseError instanceof Error ? parseError.message : String(parseError) 
    });
  }
} 