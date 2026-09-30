import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingDown, IndianRupee, AlertTriangle, AlertCircle } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: <Clock size={22} style={{ color: 'var(--accent-red)' }} />,
      title: "Train Delays",
      desc: "Disrupts passenger and freight operations across critical high-density corridors."
    },
    {
      icon: <TrendingDown size={22} style={{ color: 'var(--accent-gold)' }} />,
      title: "Underutilized Assets",
      desc: "Locomotives and coaches remain idle during uncoordinated block possessions."
    },
    {
      icon: <IndianRupee size={22} style={{ color: '#38bdf8' }} />,
      title: "Higher Operational Cost",
      desc: "Increased fuel consumption, excess crew duty hours, and reactive maintenance penalties."
    },
    {
      icon: <AlertTriangle size={22} style={{ color: '#f87171' }} />,
      title: "Complex Constraints",
      desc: "Multiple conflicting requirements across signalling, civil engineering, and timetable slots."
    }
  ];

  const delays = [
    { number: "12301", name: "Rajdhani Express", status: "Delayed 45 min", severity: "high" },
    { number: "12137", name: "Punjab Mail", status: "Delayed 30 min", severity: "medium" },
    { number: "12627", name: "Karnataka Express", status: "Rescheduled", severity: "critical" },
    { number: "12723", name: "Telangana Express", status: "Delayed 1 hr", severity: "high" }
  ];

  return (
    <section id="problem" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
        
        {/* Left Side: Problem Statement & 4 Cards */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-red)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            THE PROBLEM
          </div>

          <h2 style={{ fontSize: '2.6rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1.25rem', color: '#fff', letterSpacing: '-0.5px' }}>
            Complex Planning.<br />
            Bigger Consequences.
          </h2>

          <p style={{ color: '#aaa', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '520px' }}>
            Maintenance blocks are essential, but improper planning can lead to train delays, underutilized assets, and higher operational costs. With thousands of trains and limited track availability, manual planning becomes increasingly complex.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {problems.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div>{p.icon}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>{p.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Real-time Congestion & Delay Feed Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(180deg, #14161f 0%, #0c0d12 100%)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Corridor Bottleneck Simulation</h3>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>Unsynchronized daytime maintenance impact</p>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>
              4 Cascading Delays
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {delays.map((d) => (
              <div 
                key={d.number}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  padding: '1rem 1.25rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>{d.number}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{d.name}</div>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  background: d.severity === 'critical' ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.3)'
                }}>
                  {d.status}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'rgba(212,168,71,0.08)', borderRadius: '6px', border: '1px solid rgba(212,168,71,0.2)', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
            Manual block scheduling on track Section BSL-ET caused 2.5 hours total passenger corridor idle time.
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ProblemSection;
