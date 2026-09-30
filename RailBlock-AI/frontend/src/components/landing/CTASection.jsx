import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="section-container text-center" style={{ paddingBottom: '8rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, var(--accent-red) 0%, #6b1020 100%)',
          padding: '4rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(196, 30, 58, 0.2)'
        }}
      >
        <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1rem' }}>Ready to Modernize Your Rail Network?</h2>
        <p style={{ color: '#ffb3c1', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Join the revolution in railway management. Secure, intelligent, and built for the future.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn-secondary" style={{ borderColor: '#fff', color: '#fff' }}>
            Request Demo
          </Link>
          <Link to="/login" className="btn-primary" style={{ background: '#fff', color: 'var(--accent-red)' }}>
            Start Building
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
