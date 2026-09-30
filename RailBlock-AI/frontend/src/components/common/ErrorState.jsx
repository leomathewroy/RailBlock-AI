import React from 'react';

const ErrorState = ({ message = 'Something went wrong', retryAction }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '3rem',
      backgroundColor: 'rgba(196, 30, 58, 0.05)',
      border: '1px dashed var(--accent-red)',
      borderRadius: '8px',
      color: 'var(--text-primary)'
    }}>
      <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</span>
      <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-red)' }}>Error</h3>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>{message}</p>
      
      {retryAction && (
        <button 
          onClick={retryAction}
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--accent-red)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(196, 30, 58, 0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
