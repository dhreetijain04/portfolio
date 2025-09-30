import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProjectDetail = () => {
  const { id } = useParams();
  const { state } = useContext(AppContext);
  const { projects } = state;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find project by ID
    const foundProject = projects.find(p => p.id === id);
    setProject(foundProject);
    setLoading(false);
  }, [id, projects]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h1 style={{ color: '#6b7280', marginBottom: '1rem' }}>Project Not Found</h1>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button as={Link} to="/projects">
          ← Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} - Dhreeti Jain</title>
        <meta name="description" content={project.description} />
      </Helmet>

      {/* Project Hero */}
      <section className="hero">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <Link 
                to="/projects" 
                style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}
              >
                ← Back to Projects
              </Link>
            </div>
            
            <h1 style={{ marginBottom: '1rem' }}>{project.title}</h1>
            <p className="subtitle" style={{ marginBottom: '2rem' }}>
              {project.description}
            </p>

            {/* Project Status */}
            {project.status && (
              <div style={{ marginBottom: '2rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
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

            {/* Action Buttons */}
            <div className="btn-group">
              {project.github_url && (
                <Button
                  as="a"
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  <span style={{ marginRight: '0.5rem' }}>📂</span>
                  View on GitHub
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
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="section section-white">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Project Image */}
            {project.image_url && (
              <div style={{
                width: '100%',
                height: '400px',
                background: `url(${project.image_url}) center/cover`,
                borderRadius: '12px',
                marginBottom: '3rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}></div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
              {/* Main Content */}
              <div>
                {/* About the Project */}
                <section style={{ marginBottom: '3rem' }}>
                  <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>About This Project</h2>
                  <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#4b5563' }}>
                    <p>{project.long_description || project.description}</p>
                  </div>
                </section>

                {/* Key Features */}
                {project.key_features && project.key_features.length > 0 && (
                  <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Key Features</h2>
                    <ul style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#4b5563', paddingLeft: '1.5rem' }}>
                      {project.key_features.map((feature, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Challenges and Solutions */}
                {project.challenges && (
                  <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Challenges & Solutions</h2>
                    <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#4b5563' }}>
                      <p>{project.challenges}</p>
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Technologies Used */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Technologies Used</h3>
                    <div className="tech-tags">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Timeline */}
                {(project.start_date || project.end_date) && (
                  <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Timeline</h3>
                    <div style={{ color: '#6b7280' }}>
                      {project.start_date && (
                        <p><strong>Started:</strong> {new Date(project.start_date).toLocaleDateString()}</p>
                      )}
                      {project.end_date && (
                        <p><strong>Completed:</strong> {new Date(project.end_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Links */}
                <div className="card">
                  <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Project Links</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.5rem',
                          color: '#3b82f6',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <span style={{ marginRight: '0.5rem' }}>📂</span>
                        Source Code
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.5rem',
                          color: '#3b82f6',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <span style={{ marginRight: '0.5rem' }}>🚀</span>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects or CTA */}
      <section className="section section-blue">
        <div className="container text-center">
          <h2 style={{ marginBottom: '1rem' }}>Interested in Similar Projects?</h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
            Check out more of my work or let's discuss your next project
          </p>
          <div className="btn-group">
            <Button as={Link} to="/projects" variant="secondary">
              View All Projects
            </Button>
            <Button as={Link} to="/contact" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
              Get In Touch
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;