import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/common/Button';

const Home = () => {
  const { profile, fetchProfile } = useContext(AppContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>

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

      {/* Featured Projects */}
      <section className="section section-gray">
        <div className="container">
          <div className="text-center mb-8">
            <h2>Featured Projects</h2>
            <p>Check out some of the projects I've been working on</p>
          </div>
          
          <div className="text-center">
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