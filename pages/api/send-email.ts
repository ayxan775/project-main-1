import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

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
    // const oauthTenantId = process.env.OAUTH_TENANT_ID; // Tenant ID is often part of the token endpoint or implied for MS Graph
    const oauthUserEmail = process.env.OAUTH_USER_EMAIL; // The email address the app will send from
    const contactFormReceiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL;

    if (!oauthClientId || !oauthClientSecret || !oauthUserEmail || !contactFormReceiverEmail) {
      console.error('Email configuration environment variables are not fully set.');
      return res.status(500).json({ error: 'Server configuration error for email.', details: 'Required email environment variables missing.' });
    }

    // For Office365 with OAuth2, Nodemailer can often handle token generation
    // if configured with the service and client credentials.
    // The 'user' in auth is the email address of the account that granted permissions (the sender).
    const transporter = nodemailer.createTransport({
      service: 'Outlook365', // Use the Outlook365 service for built-in OAuth2 handling
      auth: {
        type: 'OAuth2',
        user: oauthUserEmail,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        // refreshToken: process.env.OAUTH_REFRESH_TOKEN, // If you have a refresh token for a specific user (delegated)
        // accessToken: process.env.OAUTH_ACCESS_TOKEN, // If you manage tokens externally (less common for client_credentials)
        // For client_credentials (application permissions), Nodemailer usually handles token fetching
        // The tenantId might be implicitly handled by the MS Graph endpoints Nodemailer uses,
        // or sometimes it's part of token acquisition URLs if you were doing it manually.
        // For Nodemailer's built-in Outlook365 service, client/secret/user is often enough for app permissions.
      },
      // tls: { // This might not be needed or could conflict with service:'Outlook365'
      //   ciphers: 'SSLv3', 
      // }
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
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // For OAuth errors, the error object might have more specific details.
      // e.g., if (error.response && error.response.data) console.error('OAuth Error Response:', error.response.data);
      //      else if (error.code) console.error('Nodemailer Error Code:', error.code);
      return res.status(500).json({ error: 'Failed to send email.', details: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}