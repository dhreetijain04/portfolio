import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';

const Contact = () => {
  const { theme } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Please provide a valid email address';
    }
    
    if (!formData.subject || formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Validate form before submitting
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Use your own backend API instead of Formspree
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        console.log('Form submitted successfully:', result.message);
      } else {
        console.error('Form submission failed:', result.error || result.errors);
        setSubmitStatus('error');
        // Show specific error message from server
        if (result.error) {
          alert(result.error);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                      <p style={{ color: '#000000' }}>+91 9818909530</p>
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

              <div className="contact-form-section">
                <div className="card">
                  <h2 style={{ color: '#f1f5f9', marginBottom: '1.5rem' }}>Send Me a Message</h2>
                  
                  {submitStatus === 'success' && (
                    <div className="alert alert-success" style={{ 
                      background: 'rgba(34, 197, 94, 0.1)', 
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1.5rem',
                      color: '#22c55e'
                    }}>
                      ✅ Message sent successfully! 
                      <br />
                      <small style={{ opacity: 0.8 }}>
                        I'll respond within 24 hours.
                      </small>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="alert alert-error" style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1.5rem',
                      color: '#ef4444'
                    }}>
                      ❌ Failed to send message. Please try again or email me directly at: 
                      <br />
                      <a href="mailto:dhreetijain04@gmail.com" style={{ color: '#ef4444', textDecoration: 'underline' }}>
                        dhreetijain04@gmail.com
                      </a>
                    </div>
                  )}
                  
                  <form 
                    onSubmit={handleSubmit}
                    className="contact-form"
                  >
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                        style={{
                          borderColor: errors.name ? '#ef4444' : undefined
                        }}
                      />
                      {errors.name && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          {errors.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="your.email@example.com"
                        style={{
                          borderColor: errors.email ? '#ef4444' : undefined
                        }}
                      />
                      {errors.email && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          {errors.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={`form-input ${errors.subject ? 'error' : ''}`}
                        placeholder="What's this about?"
                        style={{
                          borderColor: errors.subject ? '#ef4444' : undefined
                        }}
                      />
                      {errors.subject && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          {errors.subject}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="form-label">
                        Message
                        <span style={{ 
                          float: 'right', 
                          fontSize: '0.875rem', 
                          color: formData.message.length < 10 ? '#ef4444' : '#10b981'
                        }}>
                          {formData.message.length}/10 min
                        </span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className={`form-textarea ${errors.message ? 'error' : ''}`}
                        placeholder="Tell me about your project or opportunity..."
                        style={{
                          borderColor: errors.message ? '#ef4444' : undefined
                        }}
                      ></textarea>
                      {errors.message && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          {errors.message}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending... ⏳' : 'Send Message 📧'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="contact-footer">
              <div className="social-links">
                <h3 style={{ color: '#f1f5f9', marginBottom: '1.5rem', textAlign: 'center' }}>Connect With Me</h3>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '2rem', 
                  flexWrap: 'wrap' 
                }}>
                  <a 
                    href="https://github.com/dhreetijain04" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#e2e8f0',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>💼</span>
                    <span>GitHub</span>
                  </a>
                  <a 
                    href="https://linkedin.com/in/dhreeti-jain" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#e2e8f0',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🔗</span>
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href="mailto:dhreetijain04@gmail.com"
                    className="social-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#e2e8f0',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>📧</span>
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
