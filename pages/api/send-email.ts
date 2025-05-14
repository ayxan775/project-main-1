import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// No XOAuth2 import needed if service handles it.

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

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const oauthClientId = process.env.OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
    const oauthUserEmail = process.env.OAUTH_USER_EMAIL; 
    const contactFormReceiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL;
    // const oauthTenantId = process.env.OAUTH_TENANT_ID; // Not directly used in this auth config

    if (!oauthClientId || !oauthClientSecret || !oauthUserEmail || !contactFormReceiverEmail) {
      console.error('Email configuration environment variables are not fully set (Client ID, Client Secret, User Email, Receiver Email).');
      return res.status(500).json({ error: 'Server configuration error for email.', details: 'Required email environment variables missing.' });
    }

    console.log('Initializing Nodemailer with service:Outlook365 and OAuth2 credentials...');
    console.log(`Using OAUTH_USER_EMAIL: ${oauthUserEmail}`);
    console.log(`Using OAUTH_CLIENT_ID: ${oauthClientId ? 'Set' : 'NOT SET'}`);
    // Do NOT log client secret

    const transporter = nodemailer.createTransport({
      service: 'Outlook365', // This should configure host, port, and OAuth2 specifics
      auth: {
        type: 'OAuth2',
        user: oauthUserEmail,       // The email address of the account to send from
        clientId: oauthClientId,    // The Client ID of your registered application
        clientSecret: oauthClientSecret, // The Client Secret of your registered application
        // For client credentials flow with 'Outlook365' service, 
        // Nodemailer should handle token generation and refresh automatically.
        // It will use the standard Microsoft token endpoints.
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

    try {
      console.log('Attempting to send email with service:Outlook365 (final attempt style)...');
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully with service:Outlook365.');
      return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (err) { 
      const error = err as any; 

      console.error('--- Full Error Object Start (service:Outlook365 Final Attempt) ---');
      console.error(error); 
      console.error('--- Full Error Object End (service:Outlook365 Final Attempt) ---');

      let detailedErrorMessage = 'Unknown error during email sending.';
      if (error instanceof Error) { 
        detailedErrorMessage = error.message;
      } else if (typeof error === 'string') {
        detailedErrorMessage = error;
      }
      
      if (error.response && error.response.data) {
        console.error('OAuth HTTP Response Body from original error:', JSON.stringify(error.response.data, null, 2));
        detailedErrorMessage += ` | Server Response: ${JSON.stringify(error.response.data)}`;
      } else if (error.code) {
        console.error('Nodemailer Error Code:', error.code);
        detailedErrorMessage += ` | Nodemailer Code: ${error.code}`;
      }
      if (error.reason) {
        console.error('OAuth Error Reason:', error.reason);
        detailedErrorMessage += ` | Reason: ${error.reason}`;
      }
      if (error.responseBody) {
        console.error('Error Response Body:', error.responseBody);
        detailedErrorMessage += ` | Response Body: ${error.responseBody}`;
      }
      if (error.stack) {
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