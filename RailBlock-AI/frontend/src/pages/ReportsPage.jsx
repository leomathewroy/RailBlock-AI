import React from 'react';
import { motion } from 'framer-motion';

const ReportsPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '20px', color: '#e8e6e3' }}>
      <h1>Reports</h1>
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button style={{ background: '#1a1a24', border: '1px solid #333', color: '#e8e6e3', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}>Monthly Block Summary</button>
        <button style={{ background: '#1a1a24', border: '1px solid #333', color: '#e8e6e3', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}>Efficiency Report</button>
        <button style={{ background: '#1a1a24', border: '1px solid #333', color: '#e8e6e3', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}>Delay Analysis</button>
        <button style={{ background: '#c41e3a', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Generate New</button>
      </div>
      <div style={{ marginTop: '30px', padding: '30px', background: '#1a1a24', borderRadius: '8px', border: '1px solid #333' }}>
        <p style={{ color: '#aaa' }}>Select a report type above to generate and view structured data or export as PDF/CSV.</p>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
