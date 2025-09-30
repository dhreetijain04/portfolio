const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userResult = await query(`
      SELECT u.id, u.email, u.role,
             p.id as profile_id, p.first_name, p.last_name, p.title, p.bio,
             p.location, p.phone, p.website, p.resume, p.avatar,
             p.github_url, p.linkedin_url, p.twitter_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [decoded.id]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Token is not valid'
      });
    }

    const userData = userResult.rows[0];
    const user = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      profile: userData.profile_id ? {
        id: userData.profile_id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        title: userData.title,
        bio: userData.bio,
        location: userData.location,
        phone: userData.phone,
        website: userData.website,
        resume: userData.resume,
        avatar: userData.avatar,
        githubUrl: userData.github_url,
        linkedinUrl: userData.linkedin_url,
        twitterUrl: userData.twitter_url
      } : null
    };

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Token is not valid'
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user && req.user.role === 'ADMIN') {
        next();
      } else {
        res.status(403).json({
          success: false,
          error: 'Access denied. Admin role required.'
        });
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authorization failed'
    });
  }
};

module.exports = { auth, adminAuth };