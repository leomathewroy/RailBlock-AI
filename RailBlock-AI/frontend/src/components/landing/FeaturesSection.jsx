import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, ShieldAlert, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar size={26} style={{ color: 'var(--accent-red)' }} />,
      title: "Automatic Block Planning",
      desc: "Optimal schedules with minimal conflicts using advanced integer programming and CP-SAT solvers.",
      link: "/dashboard/block-planning"
    },
    {
      icon: <TrendingUp size={26} style={{ color: 'var(--accent-gold)' }} />,
      title: "Asset Availability Prediction",
      desc: "Predict locomotive and coach availability to prevent bottleneck idling and duty overtime.",
      link: "/dashboard/assets"
    },
    {
      icon: <ShieldAlert size={26} style={{ color: '#60a5fa' }} />,
      title: "Conflict Detection",
      desc: "Identify and resolve scheduling conflicts before maintenance equipment is deployed on-track.",
      link: "/dashboard/alerts"
    },
    {
      icon: <BarChart3 size={26} style={{ color: '#4ade80' }} />,
      title: "Interactive Visualizations",
      desc: "Plotly Gantt timeline charts, what-if sensitivity analysis, and divisional performance analytics.",
      link: "/dashboard/analytics"
    }
  ];

  return (
    <section id="features" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      
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
              02
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-red)', textTransform: 'uppercase' }}>
              KEY FEATURES
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Everything for Efficient Railway Operations
          </h2>
        </div>

        <Link 
          to="/dashboard"
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
          <span>Explore All Features</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 4 Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
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
              transition: 'border-color 0.2s'
            }}
          >
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              {f.icon}
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '0.6rem' }}>
              {f.title}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1, marginBottom: '1.5rem' }}>
              {f.desc}
            </p>

            <Link 
              to={f.link}
              style={{
                color: 'var(--accent-gold)',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none'
              }}
            >
              <span>Launch Feature</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default FeaturesSection;
