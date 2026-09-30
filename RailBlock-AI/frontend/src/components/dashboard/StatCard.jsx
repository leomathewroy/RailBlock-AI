import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, trendLabel, delay = 0 }) => {
  const isPositive = trend > 0;
  const trendColor = isPositive ? '#4caf50' : 'var(--accent-red)';
  const TrendIcon = isPositive ? '▲' : '▼';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</h4>
        <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>{icon}</span>
      </div>
      
      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}
      </div>
      
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: trendColor, display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            {TrendIcon} {Math.abs(trend)}%
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
