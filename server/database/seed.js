const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const userResult = await query(`
      INSERT INTO users (email, password, role) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (email) DO UPDATE SET password = $2, role = $3
      RETURNING id
    `, ['dhreetijain04@gmail.com', hashedPassword, 'ADMIN']);
    
    const userId = userResult.rows[0].id;
    console.log('✅ Admin user created');
    
    // Create profile
    await query(`
      INSERT INTO profiles (
        user_id, first_name, last_name, title, bio, location, phone, website, 
        github_url, linkedin_url, twitter_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (user_id) DO UPDATE SET
        first_name = $2, last_name = $3, title = $4, bio = $5, location = $6,
        phone = $7, website = $8, github_url = $9, linkedin_url = $10, twitter_url = $11
    `, [
      userId,
      'Dhreeti',
      'Jain', 
      'Full Stack Developer & AI Enthusiast',
      'Passionate Electronics and Communication Engineering student at MAIT with expertise in full-stack development. Currently building innovative AI-powered solutions and contributing to open-source projects. Core Team Member at IEEE MAIT with strong foundation in Data Structures & Algorithms.',
      'New Delhi, India',
      '+91 9818909530',
      'https://dhreetijain.dev',
      'https://github.com/dhreetijain04',
      'https://linkedin.com/in/dhreeti-jain-736b66293',
      'https://twitter.com/dhreetijain04'
    ]);
    
    console.log('✅ Profile created');
    
    // Create sample skills
    const skills = [
      // Programming Languages
      { name: 'JavaScript', category: 'PROGRAMMING_LANGUAGE', proficiency: 5, color: '#F7DF1E' },
      { name: 'Java', category: 'PROGRAMMING_LANGUAGE', proficiency: 4, color: '#ED8B00' },
      { name: 'C', category: 'PROGRAMMING_LANGUAGE', proficiency: 4, color: '#A8B9CC' },
      
      // Frameworks & Libraries
      { name: 'React.js', category: 'FRAMEWORK_LIBRARY', proficiency: 5, color: '#61DAFB' },
      { name: 'Node.js', category: 'FRAMEWORK_LIBRARY', proficiency: 5, color: '#339933' },
      { name: 'Express.js', category: 'FRAMEWORK_LIBRARY', proficiency: 5, color: '#000000' },
      { name: 'Bootstrap', category: 'FRAMEWORK_LIBRARY', proficiency: 4, color: '#7952B3' },
      
      // Databases
      { name: 'PostgreSQL', category: 'DATABASE', proficiency: 4, color: '#336791' },
      
      // Tools & Technologies
      { name: 'HTML', category: 'TOOL_TECHNOLOGY', proficiency: 5, color: '#E34F26' },
      { name: 'CSS', category: 'TOOL_TECHNOLOGY', proficiency: 5, color: '#1572B6' },
      { name: 'VS Code', category: 'TOOL_TECHNOLOGY', proficiency: 5, color: '#007ACC' },
      { name: 'Git/GitHub', category: 'TOOL_TECHNOLOGY', proficiency: 5, color: '#F05032' },
      { name: 'Apache Tomcat', category: 'TOOL_TECHNOLOGY', proficiency: 3, color: '#F8DC75' },
      { name: 'Eclipse IDE', category: 'TOOL_TECHNOLOGY', proficiency: 3, color: '#2C2255' },
      
      // Cloud & DevOps
      { name: 'Netlify', category: 'CLOUD_DEVOPS', proficiency: 4, color: '#00C7B7' },
      { name: 'Render', category: 'CLOUD_DEVOPS', proficiency: 4, color: '#46E3B7' },
      
      // Core Skills
      { name: 'Data Structures & Algorithms', category: 'SOFT_SKILL', proficiency: 4, color: '#8B5CF6' },
      { name: 'Object Oriented Programming', category: 'SOFT_SKILL', proficiency: 4, color: '#10B981' },
      { name: 'Problem Solving', category: 'SOFT_SKILL', proficiency: 5, color: '#F59E0B' },
      { name: 'Team Leadership', category: 'SOFT_SKILL', proficiency: 4, color: '#EF4444' },
    ];
    
    for (const skill of skills) {
      await query(`
        INSERT INTO skills (name, category, proficiency, color)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO UPDATE SET
          category = $2, proficiency = $3, color = $4
      `, [skill.name, skill.category, skill.proficiency, skill.color]);
    }
    
    console.log('✅ Skills created');
    
    // Create sample projects
    const projects = [
      {
        title: 'AgroAI - AI-Powered Farming Assistant',
        description: 'AI-Powered Farming Assistant with Google Gemini AI + YOLOv8 pest detection for personalized crop recommendations',
        longDescription: 'AgroAI is an innovative agricultural platform that combines Google Gemini AI with YOLOv8 computer vision for intelligent pest detection. The platform provides personalized crop recommendations, smart advisory services, and real-time pest identification with bounding box visualization. Built with a scalable full-stack architecture using React, Node.js/Express, PostgreSQL, and ONNX Runtime.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Google Gemini AI', 'YOLOv8', 'ONNX Runtime', 'Netlify', 'Render'],
        githubUrl: 'https://github.com/dhreetijain04/AgroAI',
        liveUrl: 'https://agro-ai-app.netlify.app',
        featured: true,
        status: 'COMPLETED',
        orderIndex: 1,
      },
      {
        title: 'AI Code Review Assistant',
        description: 'GitHub-integrated platform for development code review optimization with real-time analytics',
        longDescription: 'A comprehensive code review platform that integrates with GitHub to provide intelligent code analysis and suggestions. Features include responsive UI design, real-time analytics dashboard, secure user authentication, and automated code quality assessment. The platform helps developers improve their code quality and streamline the review process.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'GitHub API', 'JWT Authentication'],
        githubUrl: 'https://github.com/dhreetijain04/ai-code-review-assistant',
        liveUrl: 'https://ai-code-review-assistant.netlify.app',
        featured: true,
        status: 'COMPLETED',
        orderIndex: 2,
      },
      {
        title: 'Portfolio Website',
        description: 'Modern responsive portfolio website built with PERN stack',
        longDescription: 'A professional portfolio website showcasing projects, skills, and experience. Built with the PERN stack (PostgreSQL, Express, React, Node.js) featuring responsive design, smooth animations, contact form functionality, and admin dashboard for content management.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'CSS3', 'HTML5'],
        githubUrl: 'https://github.com/dhreetijain04/portfolio',
        liveUrl: 'https://dhreetijain.dev',
        featured: false,
        status: 'IN_PROGRESS',
        orderIndex: 3,
      }
    ];
    
    for (const project of projects) {
      await query(`
        INSERT INTO projects (
          user_id, title, description, long_description, technologies, 
          github_url, live_url, featured, status, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        userId, project.title, project.description, project.longDescription,
        project.technologies, project.githubUrl, project.liveUrl,
        project.featured, project.status, project.orderIndex
      ]);
    }
    
    console.log('✅ Projects created');
    
    // Create sample experience
    const experiences = [
      {
        company: 'DRDO (Defence Research and Development Organisation)',
        position: 'Project Intern',
        description: 'Developed user interfaces using HTML, CSS, and JavaScript. Worked with Apache Tomcat and Eclipse IDE to contribute to an ongoing internal project. Assisted in integrating front-end components with the application workflow and testing in the local server environment.',
        location: 'New Delhi, India',
        startDate: '2024-06-01',
        endDate: '2024-07-31',
        currentJob: false,
        technologies: ['HTML', 'CSS', 'JavaScript', 'Apache Tomcat', 'Eclipse IDE'],
        achievements: [
          'Developed responsive user interfaces for internal defense applications',
          'Successfully integrated front-end components with existing application workflow',
          'Contributed to testing and optimization in local server environment',
        ],
        orderIndex: 1,
      },
    ];
    
    for (const experience of experiences) {
      await query(`
        INSERT INTO experiences (
          user_id, company, position, description, location, start_date, 
          end_date, current_job, technologies, achievements, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        userId, experience.company, experience.position, experience.description,
        experience.location, experience.startDate, experience.endDate,
        experience.currentJob, experience.technologies, experience.achievements,
        experience.orderIndex
      ]);
    }
    
    console.log('✅ Experience created');
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedDatabase;