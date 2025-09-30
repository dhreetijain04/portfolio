import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Projects = () => {
  const { projects, loading, fetchProjects } = useContext(AppContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Projects - Dhreeti Jain</title>
        <meta name="description" content="Explore the projects built by Dhreeti Jain - Full Stack Developer. Featuring modern web applications and innovative solutions." />
      </Helmet>

      {/* Projects Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 style={{ color: '#f1f5f9' }}>My Projects</h1>
            <p className="subtitle" style={{ color: '#000000' }}>
              A collection of projects I've worked on, showcasing my skills in full-stack development
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section section-white">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                {/* Project Image */}
                {project.image_url && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: `url(${project.image_url}) center/cover`,
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '1rem'
                  }}></div>
                )}
                
                <div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                    
                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="tech-tags">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Project Status */}
                    {project.status && (
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          backgroundColor: project.status === 'COMPLETED' ? '#10b981' : 
                                         project.status === 'IN_PROGRESS' ? '#f59e0b' : '#6b7280',
                          color: 'white'
                        }}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                    )}

                    {/* Key Features */}
                    {project.key_features && project.key_features.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>
                          Key Features:
                        </h4>
                        <ul style={{ fontSize: '0.875rem', color: '#000000', paddingLeft: '1rem' }}>
                          {project.key_features.slice(0, 3).map((feature, index) => (
                            <li key={index} style={{ marginBottom: '0.25rem' }}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Project Actions */}
                  <div className="project-links">
                    {project.github_url && (
                      <Button
                        as="a"
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                      >
                        <span style={{ marginRight: '0.5rem' }}>📂</span>
                        GitHub
                      </Button>
                    )}
                    {project.live_url && (
                      <Button
                        as="a"
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span style={{ marginRight: '0.5rem' }}>🚀</span>
                        Live Demo
                      </Button>
                    )}
                    <Button
                      as={Link}
                      to={`/projects/${project.id}`}
                      variant="ghost"
                    >
                      View Details →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '3rem', color: '#f1f5f9' }}>Featured Projects</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* AgroAI */}
            <div className="card">
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🌱 AgroAI</h3>
              <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
                AI-powered agricultural assistant helping farmers make data-driven decisions 
                for crop management and yield optimization.
              </p>
              <div className="tech-tags">
                <span className="tech-tag">Python</span>
                <span className="tech-tag">Machine Learning</span>
                <span className="tech-tag">React</span>
                <span className="tech-tag">Flask</span>
              </div>
            </div>

            {/* E-Commerce Platform */}
            <div className="card">
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🛒 E-Commerce Platform</h3>
              <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
                Full-stack e-commerce solution with modern payment integration, 
                inventory management, and responsive design.
              </p>
              <div className="tech-tags">
                <span className="tech-tag">React</span>
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">PostgreSQL</span>
                <span className="tech-tag">Express.js</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section section-blue">
        <div className="container text-center">
          <h2 style={{ marginBottom: '1rem' }}>Interested in Collaborating?</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
            I'm always open to discussing new projects and opportunities
          </p>
          <Button as={Link} to="/contact" variant="secondary">
            Get In Touch
          </Button>
        </div>
      </section>
    </>
  );
};

export default Projects;