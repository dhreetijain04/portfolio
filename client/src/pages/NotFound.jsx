import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Dhreeti Jain</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <section className="section section-white" style={{ padding: '5rem 0' }}>
        <div className="container text-center">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* 404 Illustration */}
            <div style={{
              fontSize: '8rem',
              fontWeight: 'bold',
              color: '#e5e7eb',
              marginBottom: '2rem',
              lineHeight: '1'
            }}>
              404
            </div>

            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              Page Not Found
            </h1>

            <p style={{ 
              fontSize: '1.25rem', 
              color: '#6b7280', 
              marginBottom: '3rem',
              lineHeight: '1.6'
            }}>
              Sorry, the page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>

            {/* Action Buttons */}
            <div className="btn-group">
              <Button as={Link} to="/">
                🏠 Go Home
              </Button>
              <Button as={Link} to="/projects" variant="outline">
                📂 View Projects
              </Button>
            </div>

            {/* Helpful Links */}
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
              <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
                Looking for something specific?
              </h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '2rem', 
                flexWrap: 'wrap',
                fontSize: '1rem'
              }}>
                <Link 
                  to="/about" 
                  style={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  👤 About Me
                </Link>
                <Link 
                  to="/projects" 
                  style={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💼 My Projects
                </Link>
                <Link 
                  to="/contact" 
                  style={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📧 Contact
                </Link>
              </div>
            </div>

            {/* Error Reporting */}
            <div style={{ 
              marginTop: '3rem', 
              padding: '1.5rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>
                Think this is a mistake?
              </h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                If you believe you've encountered a broken link or error, please let me know!
              </p>
              <Button 
                as="a" 
                href="mailto:dhreeti.jain@example.com?subject=Broken Link Report"
                variant="outline"
                style={{ fontSize: '0.875rem' }}
              >
                📧 Report Issue
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;