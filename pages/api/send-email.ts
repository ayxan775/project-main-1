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

    // Create a transporter object using the default SMTP transport
    // You'll need to set these environment variables
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com', // Microsoft's SMTP server
      port: 587,
      secure: false, // true for 465, false for other ports (587 uses STARTTLS)
      auth: {
        user: process.env.EMAIL_SERVER_USER, // Your Microsoft email address
        pass: process.env.EMAIL_SERVER_PASSWORD, // Your Microsoft email password
      },
      tls: {
        ciphers:'SSLv3'
      }
    });

    // Email options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_SERVER_USER}>`, // Sender address (shows your email, but name is from form)
      replyTo: email, // Reply-To field set to the form submitter's email
      to: process.env.CONTACT_FORM_RECEIVER_EMAIL, // List of receivers
      subject: `Contact Form: ${subject}`, // Subject line
      text: `You have a new message from ${name} (${email}):\n\n${message}`, // Plain text body
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
      `, // HTML body
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: 'Failed to send email.', details: errorMessage });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}