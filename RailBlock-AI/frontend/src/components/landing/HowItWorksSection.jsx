import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Settings, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Database size={24} style={{ color: '#60a5fa' }} />,
      stepNum: "Step 01",
      title: "Data Collection",
      desc: "Train schedules, track sections, rolling stock telemetry, and civil engineering maintenance requirements."
    },
    {
      icon: <Cpu size={24} style={{ color: 'var(--accent-red)' }} />,
      stepNum: "Step 02",
      title: "AI/ML Prediction",
      desc: "Predict section delays, asset failure probability, and congestion risks using XGBoost & Scikit-learn."
    },
    {
      icon: <Settings size={24} style={{ color: 'var(--accent-gold)' }} />,
      stepNum: "Step 03",
      title: "Optimization",
      desc: "Generate conflict-free, optimal block schedules with Google OR-Tools CP-SAT multi-objective solver."
    },
    {
      icon: <BarChart3 size={24} style={{ color: '#4ade80' }} />,
      stepNum: "Step 04",
      title: "Results & Visualization",
      desc: "Gantt timeline views, what-if scenario testing, decision-support alerts, and PDF operational reports."
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '3.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid var(--accent-red)',
              color: 'var(--accent-red)',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              01
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-red)', textTransform: 'uppercase' }}>
              HOW IT WORKS
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            From Data to Optimized Plans
          </h2>
        </div>

        <Link 
          to="/dashboard/block-planning"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: '#fff',
            padding: '0.65rem 1.25rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            textDecoration: 'none'
          }}
        >
          <span>View Architecture</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 4 Connected Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', position: 'relative' }}>
        {steps.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {s.icon}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>{s.stepNum}</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '0.6rem' }}>
              {s.title}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default HowItWorksSection;
