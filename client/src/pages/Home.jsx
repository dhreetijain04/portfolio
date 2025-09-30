import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const { profile, projects, loading, fetchProfile, fetchProjects } = useContext(AppContext);

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dhreeti Jain - Full Stack Developer</title>
        <meta name="description" content="Full Stack Developer passionate about creating innovative solutions. Currently pursuing ECE at MAIT while building next-generation applications." />
        <meta name="keywords" content="Full Stack Developer, React, Node.js, PostgreSQL, JavaScript, TypeScript" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1>
              Hi, I'm <span className="highlight">Dhreeti Jain</span>
            </h1>
            <p className="subtitle">
              {profile?.bio || 'Full Stack Developer'}
            </p>
            <p className="description">
              ECE student at MAIT with expertise in full-stack development. 
              Building innovative AI-powered solutions and next-generation web applications.
            </p>
            <div className="btn-group">
              <Button as={Link} to="/projects">
                View My Work
              </Button>
              <Button as={Link} to="/contact" variant="outline">
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section section-white">
        <div className="container">
          <h2 className="text-center">Technologies I Work With</h2>
          <div className="skills-grid">
            {['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Express.js', 'Git', 'TypeScript', 'REST APIs'].map((skill) => (
              <div key={skill} className="skill-card">
                <p>{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section section-gray">
        <div className="container">
          <div className="text-center mb-8">
            <h2>Featured Projects</h2>
            <p>Some of the projects I've worked on recently</p>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="projects-grid">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="project-card">
                  <div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="tech-tags">
                      {project.technologies?.map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="project-links">
                    {project.github_url && (
                      <Button
                        as="a"
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                      >
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
                        Live Demo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button as={Link} to="/projects" variant="outline">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-blue">
        <div className="container text-center">
          <h2>Let's Build Something Amazing Together</h2>
          <p style={{ marginBottom: '2rem' }}>
            I'm always interested in new opportunities and collaborations
          </p>
          <Button as={Link} to="/contact" variant="secondary">
            Start a Conversation
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;