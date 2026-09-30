import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, CheckCircle2 } from 'lucide-react';

const SolutionSection = () => {
  return (
    <section id="solution" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-red)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
          OUR SOLUTION
        </div>

        <h2 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '1.5rem', color: '#fff', letterSpacing: '-0.5px' }}>
          AI-Powered Automatic Block Planning
        </h2>

        <p style={{ fontSize: '1.15rem', color: '#b0b0b8', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Our system uses machine learning and optimization algorithms to automatically generate efficient block plans, ensuring maximum asset availability and minimal impact on train operations.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <a 
            href="#how-it-works"
            style={{
              background: 'var(--accent-red)',
              color: '#fff',
              padding: '0.85rem 1.75rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(196, 30, 58, 0.4)'
            }}
          >
            <span>How It Works</span>
            <ArrowRight size={16} />
          </a>
          <Link 
            to="/dashboard/block-planning"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '0.85rem 1.5rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <span>Test the Optimizer</span>
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: '#aaa', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
            0 Disruption to Rajdhani & Vande Bharat
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--accent-gold)' }} />
            Google OR-Tools CP-SAT Solver
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} style={{ color: '#60a5fa' }} />
            XGBoost Delay Ingestion
          </span>
        </div>

      </div>
    </section>
  );
};

export default SolutionSection;
