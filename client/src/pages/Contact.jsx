import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { AppContext } from '../contexts/AppContext';

const Contact = () => {
  const { theme } = useContext(AppContext);

  return (
    <>
      <Helmet>
        <title>Contact - Dhreeti Jain</title>
        <meta name="description" content="Get in touch with Dhreeti Jain for collaboration opportunities, project inquiries, or professional connections." />
      </Helmet>

      <div className="contact-page">
        <div className="container">
          <div className="contact-content">
            <div className="contact-header">
              <h1 className="page-title" style={{ color: '#f1f5f9' }}>Get In Touch</h1>
              <p className="page-subtitle" style={{ color: '#000000' }}>
                Let's discuss opportunities, collaborations, or any questions you might have
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-info-card">
                  <h2 style={{ color: '#f1f5f9' }}>Contact Information</h2>
                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    <div className="contact-details">
                      <h3 style={{ color: '#000000' }}>Email</h3>
                      <p style={{ color: '#000000' }}>dhreetijain04@gmail.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">📱</div>
                    <div className="contact-details">
                      <h3 style={{ color: '#000000' }}>Phone</h3>
                      <p style={{ color: '#000000' }}>+91 9819095300</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <div className="contact-details">
                      <h3 style={{ color: '#000000' }}>Location</h3>
                      <p style={{ color: '#000000' }}>Delhi, India</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">💼</div>
                    <div className="contact-details">
                      <h3 style={{ color: '#000000' }}>GitHub</h3>
                      <p>
                        <a 
                          href="https://github.com/dhreetijain04" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="contact-link"
                        >
                          github.com/dhreetijain04
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="availability-card">
                  <h3 style={{ color: '#f1f5f9' }}>Availability</h3>
                  <p style={{ color: '#000000' }}>
                    Currently available for full-time opportunities and freelance projects. 
                    I typically respond to messages within 24 hours.
                  </p>
                  <div className="availability-status">
                    <span className="status-indicator"></span>
                    <span style={{ color: '#000000' }}>Available for new opportunities</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-footer">
              <div className="social-links">
                <h3 style={{ color: '#f1f5f9' }}>Connect With Me</h3>
                <div className="social-grid">
                  <a 
                    href="https://github.com/dhreetijain04" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <span className="social-icon">💼</span>
                    <span>GitHub</span>
                  </a>
                  <a 
                    href="https://linkedin.com/in/dhreeti-jain" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <span className="social-icon">🔗</span>
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href="mailto:dhreetijain04@gmail.com"
                    className="social-link"
                  >
                    <span className="social-icon">📧</span>
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
