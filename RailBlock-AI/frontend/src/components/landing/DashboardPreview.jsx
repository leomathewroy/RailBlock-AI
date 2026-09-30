import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Train, Zap, Wrench, Clock, User, Search, Layers, Calendar, BarChart2 } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section id="preview" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      
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
              03
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-red)', textTransform: 'uppercase' }}>
              DASHBOARD PREVIEW
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Real-Time Insights for Better Decisions
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
          <span>View Full Dashboard</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Realistic Control Room Mockup Frame (Direct replication of design screenshot) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          background: '#0d0e14',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.8)',
          overflow: 'hidden'
        }}
      >
        {/* Mockup Top Navigation Bar */}
        <div style={{
          background: '#12141c',
          padding: '0.85rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>
              <Train size={20} />
              <span style={{ color: '#fff' }}>RailBlock <span style={{ color: 'var(--accent-red)' }}>AI</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.35rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', color: '#666' }}>
              <Search size={14} />
              <span>Search train number, station code, block ID...</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', border: '1px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} style={{ color: '#bbb' }} />
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ fontWeight: '600', color: '#fff' }}>Chief Traffic Controller</div>
              <div style={{ color: '#777', fontSize: '0.7rem' }}>Northern Railway HQ</div>
            </div>
          </div>
        </div>

        {/* Mockup Main Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '440px' }}>
          
          {/* Mockup Sidebar */}
          <div style={{ background: '#10121a', borderRight: '1px solid rgba(255, 255, 255, 0.06)', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {[
              { label: 'Dashboard', icon: <BarChart2 size={16} />, active: true },
              { label: 'Block Planning', icon: <Calendar size={16} /> },
              { label: 'Asset Availability', icon: <Zap size={16} /> },
              { label: 'Train Schedule', icon: <Train size={16} /> },
              { label: 'Alerts', icon: <Wrench size={16} /> }
            ].map(item => (
              <div 
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: item.active ? '600' : '400',
                  background: item.active ? 'rgba(196, 30, 58, 0.2)' : 'transparent',
                  color: item.active ? '#fff' : '#888',
                  border: item.active ? '1px solid rgba(196, 30, 58, 0.4)' : '1px solid transparent'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Mockup Content Area */}
          <div style={{ padding: '1.25rem', background: '#0a0a0f' }}>
            
            {/* 4 Mini Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#12141d', border: '1px solid #222', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Total Trains</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', margin: '0.2rem 0' }}>1,248</div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80' }}>+3.5% from last week</div>
              </div>

              <div style={{ background: '#12141d', border: '1px solid #222', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Available Locos</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-gold)', margin: '0.2rem 0' }}>412</div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80' }}>+6.1% from last week</div>
              </div>

              <div style={{ background: '#12141d', border: '1px solid #222', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Active Blocks</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-red)', margin: '0.2rem 0' }}>23</div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80' }}>-12% from last week</div>
              </div>

              <div style={{ background: '#12141d', border: '1px solid #222', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Avg. Delay</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', margin: '0.2rem 0' }}>18 min</div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80' }}>-35% from last week</div>
              </div>
            </div>

            {/* Split View: Block Schedule Gantt & Asset Availability Gauge */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              
              {/* Left: Gantt Schedule Grid */}
              <div style={{ background: '#12141d', border: '1px solid #222', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>Block Schedule (Gantt View)</div>
                  <span style={{ fontSize: '0.7rem', color: '#666' }}>01 Oct 2026 - 07 Oct 2026</span>
                </div>

                {/* Timeline Grid Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                    <span style={{ color: '#888' }}>Delhi - Agra</span>
                    <div style={{ display: 'flex', height: '14px', background: '#1a1a24', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '20%', background: '#2563eb' }}></div>
                      <div style={{ width: '25%', background: '#c41e3a', marginLeft: '10%' }}></div>
                      <div style={{ width: '30%', background: '#10b981', marginLeft: '5%' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                    <span style={{ color: '#888' }}>Agra - Gwalior</span>
                    <div style={{ display: 'flex', height: '14px', background: '#1a1a24', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '35%', background: '#10b981' }}></div>
                      <div style={{ width: '20%', background: '#c41e3a', marginLeft: '5%' }}></div>
                      <div style={{ width: '25%', background: '#2563eb', marginLeft: '10%' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                    <span style={{ color: '#888' }}>Gwalior - Bhopal</span>
                    <div style={{ display: 'flex', height: '14px', background: '#1a1a24', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '15%', background: '#c41e3a', marginLeft: '15%' }}></div>
                      <div style={{ width: '40%', background: '#2563eb', marginLeft: '5%' }}></div>
                      <div style={{ width: '20%', background: '#10b981', marginLeft: '5%' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                    <span style={{ color: '#888' }}>Bhopal - Itarsi</span>
                    <div style={{ display: 'flex', height: '14px', background: '#1a1a24', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '30%', background: '#2563eb' }}></div>
                      <div style={{ width: '25%', background: '#10b981', marginLeft: '5%' }}></div>
                      <div style={{ width: '25%', background: '#c41e3a', marginLeft: '5%' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                    <span style={{ color: '#888' }}>Itarsi - Nagpur</span>
                    <div style={{ display: 'flex', height: '14px', background: '#1a1a24', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '20%', background: '#10b981' }}></div>
                      <div style={{ width: '30%', background: '#c41e3a', marginLeft: '10%' }}></div>
                      <div style={{ width: '25%', background: '#2563eb', marginLeft: '5%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.6rem', borderTop: '1px solid #222', fontSize: '0.7rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#c41e3a', borderRadius: '2px' }}></span> Maintenance Block
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '2px' }}></span> Train Movement
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '2px' }}></span> Available
                  </span>
                </div>
              </div>

              {/* Right: Circular Asset Gauge */}
              <div style={{ background: '#12141d', border: '1px solid #222', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
                  Asset Availability
                </div>

                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '8px solid #1a1a24',
                  borderTopColor: 'var(--accent-gold)',
                  borderRightColor: 'var(--accent-gold)',
                  borderLeftColor: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  margin: '0.5rem 0'
                }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff' }}>82%</span>
                  <span style={{ fontSize: '0.6rem', color: '#888' }}>Available</span>
                </div>

                <div style={{ width: '100%', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Locomotives</span>
                    <span style={{ color: '#fff' }}>85%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Coaches</span>
                    <span style={{ color: '#fff' }}>80%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Tracks</span>
                    <span style={{ color: '#fff' }}>88%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Signalling</span>
                    <span style={{ color: '#fff' }}>76%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
};

export default DashboardPreview;
