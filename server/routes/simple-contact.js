const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Simple rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    error: 'Too many contact attempts from this IP, please try again later.'
  }
});

// Simple contact endpoint that just logs the data
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must be at least 2 characters'
      });
    }
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }
    
    if (!subject || subject.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Subject must be at least 5 characters'
      });
    }
    
    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters'
      });
    }

    // Log the contact form submission
    console.log('📧 NEW CONTACT FORM SUBMISSION:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Time:', new Date().toLocaleString());
    console.log('---');

    // Save to a simple file as backup
    const fs = require('fs');
    const contactData = {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    };
    
    const logFile = 'contact-submissions.json';
    let submissions = [];
    
    try {
      if (fs.existsSync(logFile)) {
        submissions = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      }
    } catch (e) {
      submissions = [];
    }
    
    submissions.push(contactData);
    fs.writeFileSync(logFile, JSON.stringify(submissions, null, 2));

    // Send email notification to your Gmail
    try {
      console.log('🔄 Attempting to send email...');
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'dhreetijain04@gmail.com',
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
Time: ${new Date().toLocaleString()}
        `
      });
      console.log('✅ Email sent successfully to dhreetijain04@gmail.com');
      console.log('📧 Message ID:', info.messageId);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      console.error('📋 Full error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I have received it and will get back to you soon. For urgent matters, you can also email me directly at dhreetijain04@gmail.com',
      data: {
        id: Date.now(),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'There was an error sending your message. Please try again later or email me directly at dhreetijain04@gmail.com'
    });
  }
});

module.exports = router;