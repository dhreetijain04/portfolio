const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let queryText = 'SELECT * FROM skills';
    const queryParams = [];
    
    if (category) {
      queryText += ' WHERE category = $1';
      queryParams.push(category);
    }
    
    queryText += ' ORDER BY category ASC, proficiency DESC, order_index ASC, name ASC';

    const result = await query(queryText, queryParams);
    const skills = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      proficiency: row.proficiency,
      color: row.color,
      icon: row.icon,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        skills,
        grouped: groupedSkills
      }
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id }
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private (Admin only)
router.post('/', [
  adminAuth,
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('category').isIn([
    'PROGRAMMING_LANGUAGE',
    'FRAMEWORK_LIBRARY', 
    'DATABASE',
    'TOOL_TECHNOLOGY',
    'SOFT_SKILL',
    'CLOUD_DEVOPS'
  ]).withMessage('Invalid category'),
  body('proficiency').isInt({ min: 1, max: 5 }).withMessage('Proficiency must be between 1 and 5'),
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
      name,
      category,
      proficiency,
      icon,
      color,
      order
    } = req.body;

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        proficiency: parseInt(proficiency),
        icon,
        color,
        order: order ? parseInt(order) : 0
      }
    });

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Create skill error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Skill with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id }
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    const {
      name,
      category,
      proficiency,
      icon,
      color,
      order
    } = req.body;

    const updateData = {};
    
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (proficiency !== undefined) updateData.proficiency = parseInt(proficiency);
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (order !== undefined) updateData.order = parseInt(order);

    const updatedSkill = await prisma.skill.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({
      success: true,
      data: updatedSkill
    });
  } catch (error) {
    console.error('Update skill error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Skill with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id }
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    await prisma.skill.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/skills/categories
// @desc    Get all skill categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'PROGRAMMING_LANGUAGE',
      'FRAMEWORK_LIBRARY',
      'DATABASE',
      'TOOL_TECHNOLOGY',
      'SOFT_SKILL',
      'CLOUD_DEVOPS'
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;