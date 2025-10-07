const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const { convert } = require('html-to-text');

// Create a transporter for sending emails
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use a real email service in production (e.g., SendGrid, Mailgun, etc.)
    return nodemailer.createTransport({
      service: 'SendGrid', // or your preferred email service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Use Mailtrap for development
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Compile email templates
const compileTemplate = (template, data = {}) => {
  const templatePath = path.join(__dirname, `../views/emails/${template}.pug`);
  return pug.renderFile(templatePath, data);
};

// Send email
const sendEmail = async (options) => {
  try {
    // 1) Create transporter
    const transporter = createTransporter();

    // 2) Define email options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: convert(options.html, { wordwrap: 130 })
    };

    // 3) Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('There was an error sending the email. Please try again later.');
  }
};

// Send verification email
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  
  const html = compileTemplate('verifyEmail', {
    name: user.name,
    verificationUrl,
    year: new Date().getFullYear()
  });

  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    html
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const html = compileTemplate('passwordReset', {
    name: user.name,
    resetUrl,
    year: new Date().getFullYear()
  });

  await sendEmail({
    to: user.email,
    subject: 'Your password reset token (valid for 10 minutes)',
    html
  });
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const html = compileTemplate('welcome', {
    name: user.name,
    loginUrl: `${process.env.CLIENT_URL}/login`,
    year: new Date().getFullYear()
  });

  await sendEmail({
    to: user.email,
    subject: 'Welcome to Laundry Service!',
    html
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
