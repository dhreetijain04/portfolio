const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for contact form - more restrictive
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 contact form submissions per windowMs
  message: {
    success: false,
    error: 'Too many contact attempts from this IP, please try again later.'
  }
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public (with rate limiting)
router.post('/', [
  contactLimiter,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Save contact to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
      }
    });

    // Send email notification (if configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background: white; padding: 20px; border-left: 4px solid #007bff;">
                <h3 style="color: #333; margin-top: 0;">Message:</h3>
                <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>Reply to:</strong> ${email}<br>
                  <strong>Submitted:</strong> ${new Date().toLocaleString()}
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);

        // Send auto-reply to sender
        const autoReplyOptions = {
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Thank you for contacting me!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Thank you for your message!</h2>
              
              <p>Hi ${name},</p>
              
              <p>Thank you for reaching out! I've received your message about "${subject}" and will get back to you as soon as possible.</p>
              
              <p>I typically respond within 24-48 hours. If your inquiry is urgent, feel free to reach out to me directly at ${process.env.CONTACT_EMAIL || process.env.SMTP_USER}.</p>
              
              <p>Best regards,<br>
              Dhreeeti Jain</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h4 style="margin-top: 0; color: #333;">Your message:</h4>
                <p style="color: #666; margin: 0;">${message}</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(autoReplyOptions);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      data: {
        id: contact.id,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'There was an error sending your message. Please try again later.'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    
    const where = {};
    if (status) {
      where.status = status;
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    });

    const totalCount = await prisma.contact.count({ where });

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total: totalCount,
        limit: limit ? parseInt(limit) : totalCount,
        offset: offset ? parseInt(offset) : 0
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact message (Admin only)
// @access  Private (Admin)
router.get('/:id', async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }

    // Mark as read if it's unread
    if (contact.status === 'UNREAD') {
      await prisma.contact.update({
        where: { id: req.params.id },
        data: { status: 'READ' }
      });
      contact.status = 'READ';
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact message status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', [
  body('status').isIn(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']).withMessage('Invalid status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status } = req.body;

    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }

    const updatedContact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({
      success: true,
      data: updatedContact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (Admin only)
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }

    await prisma.contact.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;