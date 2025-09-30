import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  type = 'button',
  onClick,
  as = 'button',
  className = '',
  ...props 
}) => {
  const classes = `btn btn-${variant} ${disabled ? 'disabled' : ''} ${className}`.trim();

  const Element = as;

  if (loading) {
    return (
      <Element
        type={type}
        className={classes}
        disabled={true}
        onClick={onClick}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          }}></div>
          Loading...
        </div>
      </Element>
    );
  }

  return (
    <Element
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Element>
  );
};

export default Button;