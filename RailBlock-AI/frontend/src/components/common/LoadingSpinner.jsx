import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40, color = 'var(--accent-gold)', text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{
          width: size,
          height: size,
          border: `3px solid ${color}33`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
          marginBottom: text ? '1rem' : 0
        }}
      />
      {text && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
