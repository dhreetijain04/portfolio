const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { featured, limit, offset } = req.query;
    
    let queryText = `
      SELECT p.*, 
             pr.first_name, pr.last_name
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN profiles pr ON u.id = pr.user_id
    `;
    
    const queryParams = [];
    let whereClause = '';
    
    if (featured === 'true') {
      whereClause = ' WHERE p.featured = true';
    }
    
    queryText += whereClause;
    queryText += ' ORDER BY p.featured DESC, p.order_index ASC, p.created_at DESC';
    
    if (limit) {
      queryText += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(parseInt(limit));
    }
    
    if (offset) {
      queryText += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(parseInt(offset));
    }

    const result = await query(queryText, queryParams);
    
    const projects = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      longDescription: row.long_description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      imageUrl: row.image_url,
      featured: row.featured,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user: {
        profile: row.first_name ? {
          firstName: row.first_name,
          lastName: row.last_name
        } : null
      }
    }));

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, 
             pr.first_name, pr.last_name
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN profiles pr ON u.id = pr.user_id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const row = result.rows[0];
    const project = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      longDescription: row.long_description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      imageUrl: row.image_url,
      featured: row.featured,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user: {
        profile: row.first_name ? {
          firstName: row.first_name,
          lastName: row.last_name
        } : null
      }
    };

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', [
  auth,
  upload.single('projectImage'),
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('technologies').isArray().withMessage('Technologies must be an array'),
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
      title,
      description,
      longDescription,
      technologies,
      githubUrl,
      liveUrl,
      featured,
      status,
      startDate,
      endDate
    } = req.body;

    const imageUrl = req.file ? `/uploads/projects/${req.file.filename}` : null;
    const techArray = Array.isArray(technologies) ? technologies : JSON.parse(technologies || '[]');

    const result = await query(`
      INSERT INTO projects (
        user_id, title, description, long_description, technologies,
        github_url, live_url, image_url, featured, status, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      req.user.id,
      title,
      description,
      longDescription,
      techArray,
      githubUrl,
      liveUrl,
      imageUrl,
      featured === 'true',
      status || 'COMPLETED',
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    ]);

    // Get the project with user profile
    const projectResult = await query(`
      SELECT p.*, 
             pr.first_name, pr.last_name
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN profiles pr ON u.id = pr.user_id
      WHERE p.id = $1
    `, [result.rows[0].id]);

    const row = projectResult.rows[0];
    const project = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      longDescription: row.long_description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      imageUrl: row.image_url,
      featured: row.featured,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user: {
        profile: row.first_name ? {
          firstName: row.first_name,
          lastName: row.last_name
        } : null
      }
    };

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', [
  auth,
  upload.single('projectImage'),
], async (req, res) => {
  try {
    // Check if project exists and get ownership info
    const existingResult = await query(
      'SELECT user_id FROM projects WHERE id = $1',
      [req.params.id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const project = existingResult.rows[0];

    // Check ownership or admin
    if (project.user_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this project'
      });
    }

    const {
      title,
      description,
      longDescription,
      technologies,
      githubUrl,
      liveUrl,
      featured,
      status,
      startDate,
      endDate
    } = req.body;

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (title) {
      updateFields.push(`title = $${paramIndex++}`);
      updateValues.push(title);
    }
    if (description) {
      updateFields.push(`description = $${paramIndex++}`);
      updateValues.push(description);
    }
    if (longDescription) {
      updateFields.push(`long_description = $${paramIndex++}`);
      updateValues.push(longDescription);
    }
    if (technologies) {
      updateFields.push(`technologies = $${paramIndex++}`);
      updateValues.push(Array.isArray(technologies) ? technologies : JSON.parse(technologies));
    }
    if (githubUrl !== undefined) {
      updateFields.push(`github_url = $${paramIndex++}`);
      updateValues.push(githubUrl);
    }
    if (liveUrl !== undefined) {
      updateFields.push(`live_url = $${paramIndex++}`);
      updateValues.push(liveUrl);
    }
    if (featured !== undefined) {
      updateFields.push(`featured = $${paramIndex++}`);
      updateValues.push(featured === 'true');
    }
    if (status) {
      updateFields.push(`status = $${paramIndex++}`);
      updateValues.push(status);
    }
    if (startDate !== undefined) {
      updateFields.push(`start_date = $${paramIndex++}`);
      updateValues.push(startDate ? new Date(startDate) : null);
    }
    if (endDate !== undefined) {
      updateFields.push(`end_date = $${paramIndex++}`);
      updateValues.push(endDate ? new Date(endDate) : null);
    }
    if (req.file) {
      updateFields.push(`image_url = $${paramIndex++}`);
      updateValues.push(`/uploads/projects/${req.file.filename}`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    // Add updated_at
    updateFields.push(`updated_at = $${paramIndex++}`);
    updateValues.push(new Date());
    
    // Add WHERE clause parameter
    updateValues.push(req.params.id);

    const updateQuery = `
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    await query(updateQuery, updateValues);

    // Get updated project with user profile
    const projectResult = await query(`
      SELECT p.*, 
             pr.first_name, pr.last_name
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN profiles pr ON u.id = pr.user_id
      WHERE p.id = $1
    `, [req.params.id]);

    const row = projectResult.rows[0];
    const updatedProject = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      longDescription: row.long_description,
      technologies: row.technologies,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      imageUrl: row.image_url,
      featured: row.featured,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user: {
        profile: row.first_name ? {
          firstName: row.first_name,
          lastName: row.last_name
        } : null
      }
    };

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if project exists and get ownership info
    const existingResult = await query(
      'SELECT user_id FROM projects WHERE id = $1',
      [req.params.id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const project = existingResult.rows[0];

    // Check ownership or admin
    if (project.user_id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this project'
      });
    }

    await query('DELETE FROM projects WHERE id = $1', [req.params.id]);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;