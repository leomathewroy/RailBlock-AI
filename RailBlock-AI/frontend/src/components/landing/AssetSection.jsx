import React from 'react';
import { motion } from 'framer-motion';

const AssetSection = () => {
  return (
    <section className="section-container" style={{ background: 'var(--bg-surface)' }}>
      <div className="grid-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Tokenized Asset Management</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Trains, tracks, and stations are represented as digital twins on the blockchain. This allows for transparent tracking of ownership, maintenance history, and depreciation.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-main)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-gold)' }}>✓</span> Fractional Ownership
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-gold)' }}>✓</span> Automated Maintenance Contracts
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-gold)' }}>✓</span> Lifecycle Tracking
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--accent-gold)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 0 20px rgba(212, 168, 71, 0.1)'
          }}
        >
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Smart Contract Execution</h3>
          <pre style={{ background: '#050508', padding: '1rem', borderRadius: '4px', color: '#a0a0a5', overflowX: 'auto', fontSize: '0.85rem' }}>
{`function triggerMaintenance(
  uint256 trainId
) public {
  require(
    sensorData[trainId].wear > threshold,
    "Maintenance not required"
  );
  
  // Dispatch maintenance crew
  dispatchCrew(trainId);
  
  // Log immutably
  emit MaintenanceTriggered(trainId, block.timestamp);
}`}
          </pre>
        </motion.div>
      </div>
    </section>
  );
};

export default AssetSection;
