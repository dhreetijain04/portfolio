const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/experience
// @desc    Get all experience entries
// @access  Public
router.get('/', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [
        { current: 'desc' },
        { startDate: 'desc' }
      ],
      include: {
        user: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: experiences
    });
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/experience/:id
// @desc    Get single experience entry
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/experience
// @desc    Create a new experience entry
// @access  Private
router.post('/', [
  auth,
  body('company').trim().isLength({ min: 1 }).withMessage('Company is required'),
  body('position').trim().isLength({ min: 1 }).withMessage('Position is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
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
      company,
      position,
      description,
      location,
      startDate,
      endDate,
      current,
      technologies,
      achievements
    } = req.body;

    // If current is true, set endDate to null
    const experienceData = {
      userId: req.user.id,
      company,
      position,
      description,
      location,
      startDate: new Date(startDate),
      endDate: current ? null : (endDate ? new Date(endDate) : null),
      current: current || false,
      technologies: Array.isArray(technologies) ? technologies : [],
      achievements: Array.isArray(achievements) ? achievements : []
    };

    const experience = await prisma.experience.create({
      data: experienceData,
      include: {
        user: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/experience/:id
// @desc    Update an experience entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    // Check ownership or admin
    if (experience.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this experience'
      });
    }

    const {
      company,
      position,
      description,
      location,
      startDate,
      endDate,
      current,
      technologies,
      achievements,
      order
    } = req.body;

    const updateData = {};
    
    if (company) updateData.company = company;
    if (position) updateData.position = position;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (startDate) updateData.startDate = new Date(startDate);
    if (current !== undefined) {
      updateData.current = current;
      updateData.endDate = current ? null : (endDate ? new Date(endDate) : null);
    } else if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }
    if (technologies) updateData.technologies = Array.isArray(technologies) ? technologies : [];
    if (achievements) updateData.achievements = Array.isArray(achievements) ? achievements : [];
    if (order !== undefined) updateData.order = parseInt(order);

    const updatedExperience = await prisma.experience.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        user: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedExperience
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/experience/:id
// @desc    Delete an experience entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    // Check ownership or admin
    if (experience.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this experience'
      });
    }

    await prisma.experience.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;