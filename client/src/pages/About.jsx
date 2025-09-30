import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { AppContext } from '../contexts/AppContext';

const About = () => {
  const { theme } = useContext(AppContext);

  return (
    <>
      <Helmet>
        <title>About - Dhreeti Jain</title>
        <meta name="description" content="Learn more about Dhreeti Jain - Full Stack Developer specializing in modern web technologies. Currently pursuing ECE at MAIT." />
      </Helmet>

      {/* About Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 style={{ color: '#f8fafc' }}>About Me</h1>
            <p className="subtitle" style={{ color: '#e2e8f0' }}>Full Stack Developer</p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section section-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
            {/* Profile Image */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '4rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                DJ
              </div>
              <h3 style={{ marginBottom: '0.5rem', color: '#ffffff' }}>Dhreeti Jain</h3>
              <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>Full Stack Developer</p>
              <p style={{ color: '#e2e8f0' }}>📍 Delhi, India</p>
            </div>

            {/* About Text */}
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Hello! I'm Dhreeti</h2>
              <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#000000' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Passionate Electronics and Communication Engineering student at MAIT with expertise in full-stack development.
                </p>
                
                <p style={{ marginBottom: '1.5rem' }}>
                  Currently building innovative AI-powered solutions and contributing to open-source projects 
                  while creating next-generation web applications with modern technologies.
                </p>

                <p>
                  Gained hands-on experience as a Project Intern at DRDO, contributing to cutting-edge research projects 
                  and developing practical skills in real-world applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Experience */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '3rem', color: '#f1f5f9' }}>Education & Experience</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Education */}
            <div className="card">
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>🎓 Education</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>
                  B.Tech in Electronics & Communication Engineering
                </h4>
                <p style={{ color: '#000000', marginBottom: '0.5rem' }}>
                  Maharaja Agrasen Institute of Technology, Delhi
                </p>
                <p style={{ color: '#666666', fontSize: '0.875rem' }}>2023 - 2027</p>
                <p style={{ color: '#000000', marginTop: '0.5rem' }}>
                  Specializing in cutting-edge technologies and modern engineering practices.
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="card">
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>💼 Experience</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>
                  Project Intern
                </h4>
                <p style={{ color: '#000000', marginBottom: '0.5rem' }}>
                  Defence Research and Development Organisation (DRDO)
                </p>
                <p style={{ color: '#666666', fontSize: '0.875rem' }}>Summer 2024</p>
                <p style={{ color: '#000000', marginTop: '0.5rem' }}>
                  Contributed to innovative research projects combining advanced technology and defense applications, 
                  gaining valuable experience in real-world problem-solving and cutting-edge development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section section-white">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '3rem', color: '#f1f5f9' }}>Technical Skills</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>Frontend</h3>
              <div className="tech-tags">
                <span className="tech-tag">React</span>
                <span className="tech-tag">JavaScript</span>
                <span className="tech-tag">TypeScript</span>
                <span className="tech-tag">HTML5</span>
                <span className="tech-tag">CSS3</span>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>Backend</h3>
              <div className="tech-tags">
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">Express.js</span>
                <span className="tech-tag">PostgreSQL</span>
                <span className="tech-tag">REST APIs</span>
                <span className="tech-tag">JWT Auth</span>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: '#3b82f6', marginBottom: '1rem' }}>Tools & Technologies</h3>
              <div className="tech-tags">
                <span className="tech-tag">Git</span>
                <span className="tech-tag">VS Code</span>
                <span className="tech-tag">Docker</span>
                <span className="tech-tag">Linux</span>
                <span className="tech-tag">Postman</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;