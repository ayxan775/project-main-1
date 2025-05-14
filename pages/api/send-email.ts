import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
// No longer explicitly importing XOAuth2 as Nodemailer will handle it with service:'Outlook365'

interface EmailRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body as EmailRequestBody;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // OAuth2 Configuration
    const oauthClientId = process.env.OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
    // Tenant ID is not directly used in this simplified Nodemailer config,
    // as 'Outlook365' service implies common Microsoft endpoints.
    // const oauthTenantId = process.env.OAUTH_TENANT_ID; 
    const oauthUserEmail = process.env.OAUTH_USER_EMAIL; 
    const contactFormReceiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL;

    if (!oauthClientId || !oauthClientSecret || !oauthUserEmail || !contactFormReceiverEmail) {
      console.error('Email configuration environment variables are not fully set (Client ID, Client Secret, User Email, Receiver Email).');
      return res.status(500).json({ error: 'Server configuration error for email.', details: 'Required email environment variables missing.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Outlook365', // Use the built-in Outlook365 service
      auth: {
        type: 'OAuth2',
        user: oauthUserEmail,       // The email address of the account to send from
        clientId: oauthClientId,    // The Client ID of your registered application
        clientSecret: oauthClientSecret, // The Client Secret of your registered application
        // For client credentials flow with 'Outlook365' service, 
        // Nodemailer should handle token generation and refresh automatically.
        // No need for explicit accessUrl or refreshToken here usually.
      },
    });

    // Email options
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

    try {
      console.log('Attempting to send email with service:Outlook365 and OAuth2 credentials...');
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully with service:Outlook365 and OAuth2.');
      return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (err) { 
      const error = err as any; 

      console.error('--- Full Error Object Start (service:Outlook365 Attempt) ---');
      console.error(error); 
      console.error('--- Full Error Object End (service:Outlook365 Attempt) ---');

      let detailedErrorMessage = 'Unknown error during email sending.';
      if (error instanceof Error) { 
        detailedErrorMessage = error.message;
      } else if (typeof error === 'string') {
        detailedErrorMessage = error;
      }

      const originalError = error.originalError || error.source || error; 

      if (originalError && originalError.response && originalError.response.data) { 
        console.error('OAuth HTTP Response Body:', JSON.stringify(originalError.response.data, null, 2));
        detailedErrorMessage += ` | Server Response: ${JSON.stringify(originalError.response.data)}`;
      } else if (error.code) { 
        console.error('Nodemailer Error Code:', error.code);
        detailedErrorMessage += ` | Nodemailer Code: ${error.code}`;
      }
      if(error.reason) { 
          console.error('OAuth Error Reason:', error.reason);
          detailedErrorMessage += ` | Reason: ${error.reason}`;
      }
       if (error.responseBody) { 
        console.error('Error Response Body:', error.responseBody);
        detailedErrorMessage += ` | Response Body: ${error.responseBody}`;
      }
      if (originalError && originalError.stack) {
          console.error('Original Error Stack:', originalError.stack);
      } else if (error.stack) {
          console.error('Error Stack:', error.stack);
      }

      return res.status(500).json({ 
        error: 'Failed to send email.', 
        details: detailedErrorMessage
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}