import React from 'react';
import { TrainFront } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 2rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div className="section-container" style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-red)', marginBottom: '1rem' }}>
              <TrainFront size={32} />
              <span>RailBlock<span style={{ color: 'var(--text-main)' }}>AI</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
              Next-generation railway scheduling and asset management powered by AI and Blockchain.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Platform</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <li>Features</li>
                <li>Blockchain</li>
                <li>AI Engine</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <li>About</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} RailBlock AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
