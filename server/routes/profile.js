const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get public profile
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get the main admin user's profile (for public display)
    const result = await query(`
      SELECT p.*, u.email, u.role
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.role = 'ADMIN'
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const profile = result.rows[0];

    res.json({
      success: true,
      data: {
        id: profile.id,
        userId: profile.user_id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        title: profile.title,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        website: profile.website,
        githubUrl: profile.github_url,
        linkedinUrl: profile.linkedin_url,
        twitterUrl: profile.twitter_url,
        avatar: profile.avatar,
        resume: profile.resume,
        user: {
          email: profile.email,
          role: profile.role
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, u.id as user_id, u.email, u.role
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const profile = result.rows[0];

    res.json({
      success: true,
      data: {
        id: profile.id,
        userId: profile.user_id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        title: profile.title,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        website: profile.website,
        githubUrl: profile.github_url,
        linkedinUrl: profile.linkedin_url,
        twitterUrl: profile.twitter_url,
        avatar: profile.avatar,
        resume: profile.resume,
        user: {
          id: profile.user_id,
          email: profile.email,
          role: profile.role
        }
      }
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/profile/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', [
  auth,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio must be less than 1000 characters'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('website').optional().isURL().withMessage('Please provide a valid website URL'),
  body('githubUrl').optional().isURL().withMessage('Please provide a valid GitHub URL'),
  body('linkedinUrl').optional().isURL().withMessage('Please provide a valid LinkedIn URL'),
  body('twitterUrl').optional().isURL().withMessage('Please provide a valid Twitter URL'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      title,
      bio,
      location,
      phone,
      website,
      githubUrl,
      linkedinUrl,
      twitterUrl
    } = req.body;

    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (title) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (phone !== undefined) updateData.phone = phone;
    if (website !== undefined) updateData.website = website;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;

    // Handle file uploads
    if (req.files) {
      if (req.files.avatar) {
        updateData.avatar = `/uploads/avatars/${req.files.avatar[0].filename}`;
      }
      if (req.files.resume) {
        updateData.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
    }

    // Check if profile exists
    const existingProfile = await query('SELECT * FROM profiles WHERE user_id = $1', [req.user.id]);
    
    let profile;
    if (existingProfile.rows.length > 0) {
      // Update existing profile
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbKey} = $${paramIndex}`);
        updateValues.push(updateData[key]);
        paramIndex++;
      });

      updateValues.push(req.user.id);
      
      const updateQuery = `
        UPDATE profiles 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await query(updateQuery, updateValues);
      profile = result.rows[0];
    } else {
      // Create new profile
      const result = await query(`
        INSERT INTO profiles (user_id, first_name, last_name, title, bio, location, phone, website, github_url, linkedin_url, twitter_url, avatar, resume)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
        req.user.id,
        firstName || 'First',
        lastName || 'Last',
        title || 'Developer',
        updateData.bio || null,
        updateData.location || null,
        updateData.phone || null,
        updateData.website || null,
        updateData.githubUrl || null,
        updateData.linkedinUrl || null,
        updateData.twitterUrl || null,
        updateData.avatar || null,
        updateData.resume || null
      ]);
      profile = result.rows[0];
    }

    // Get user info
    const userResult = await query('SELECT id, email, role FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    res.json({
      success: true,
      data: {
        id: profile.id,
        userId: profile.user_id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        title: profile.title,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        website: profile.website,
        githubUrl: profile.github_url,
        linkedinUrl: profile.linkedin_url,
        twitterUrl: profile.twitter_url,
        avatar: profile.avatar,
        resume: profile.resume,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/profile/avatar
// @desc    Upload profile avatar
// @access  Private
router.post('/avatar', [auth, upload.single('avatar')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Check if profile exists and update or create
    const existingProfile = await query('SELECT * FROM profiles WHERE user_id = $1', [req.user.id]);
    
    let profile;
    if (existingProfile.rows.length > 0) {
      const result = await query(`
        UPDATE profiles 
        SET avatar = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
        RETURNING *
      `, [avatarUrl, req.user.id]);
      profile = result.rows[0];
    } else {
      const result = await query(`
        INSERT INTO profiles (user_id, first_name, last_name, title, avatar)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [req.user.id, 'First', 'Last', 'Developer', avatarUrl]);
      profile = result.rows[0];
    }

    res.json({
      success: true,
      data: {
        avatar: profile.avatar
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/profile/resume
// @desc    Upload resume
// @access  Private
router.post('/resume', [auth, upload.single('resume')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    // Check if profile exists and update or create
    const existingProfile = await query('SELECT * FROM profiles WHERE user_id = $1', [req.user.id]);
    
    let profile;
    if (existingProfile.rows.length > 0) {
      const result = await query(`
        UPDATE profiles 
        SET resume = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
        RETURNING *
      `, [resumeUrl, req.user.id]);
      profile = result.rows[0];
    } else {
      const result = await query(`
        INSERT INTO profiles (user_id, first_name, last_name, title, resume)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [req.user.id, 'First', 'Last', 'Developer', resumeUrl]);
      profile = result.rows[0];
    }

    res.json({
      success: true,
      data: {
        resume: profile.resume
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/profile/stats
// @desc    Get profile statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [projectResult, experienceResult, skillResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM projects'),
      query('SELECT COUNT(*) as count FROM experiences'),
      query('SELECT COUNT(*) as count FROM skills')
    ]);

    const stats = {
      projects: parseInt(projectResult.rows[0].count),
      experience: parseInt(experienceResult.rows[0].count),
      skills: parseInt(skillResult.rows[0].count),
      yearsOfExperience: 0 // Will be calculated based on experience data
    };

    // Calculate years of experience
    const experienceData = await query(`
      SELECT start_date, end_date, current
      FROM experiences
    `);

    if (experienceData.rows.length > 0) {
      const totalMonths = experienceData.rows.reduce((total, exp) => {
        const start = new Date(exp.start_date);
        const end = exp.current ? new Date() : new Date(exp.end_date);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                      (end.getMonth() - start.getMonth());
        return total + Math.max(0, months);
      }, 0);
      
      stats.yearsOfExperience = Math.floor(totalMonths / 12);
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;