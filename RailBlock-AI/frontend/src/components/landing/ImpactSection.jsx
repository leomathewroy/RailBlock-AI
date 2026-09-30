import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Leaf, ShieldCheck } from 'lucide-react';

const ImpactSection = () => {
  const impacts = [
    {
      icon: <Users size={24} style={{ color: '#60a5fa' }} />,
      title: "Better Passenger Experience",
      desc: "Reduced delays and improved on-time arrival reliability across all passenger and express train services."
    },
    {
      icon: <TrendingUp size={24} style={{ color: 'var(--accent-gold)' }} />,
      title: "Cost Efficiency",
      desc: "Lower operational costs and superior rolling stock asset utilization, minimizing unnecessary locomotive idling."
    },
    {
      icon: <Leaf size={24} style={{ color: '#4ade80' }} />,
      title: "Environmental Benefits",
      desc: "Reduced fuel wastage and traction energy losses from standing congestion and erratic speed decelerations."
    },
    {
      icon: <ShieldCheck size={24} style={{ color: 'var(--accent-red)' }} />,
      title: "Safer Operations",
      desc: "Well-planned civil engineering and OHE maintenance blocks without rushed shortcuts or timetable collisions."
    }
  ];

  return (
    <section id="impact" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      
      {/* Section Header */}
      <div style={{ marginBottom: '3.5rem' }}>
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
            04
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-red)', textTransform: 'uppercase' }}>
            IMPACT
          </span>
        </div>

        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
          Building a More Reliable and Efficient Railway Network
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {impacts.map((item, idx) => (
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
              flexDirection: 'column'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              {item.icon}
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '0.6rem' }}>
              {item.title}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default ImpactSection;
