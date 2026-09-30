import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingDown, TrendingUp, CheckCircle, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-section" style={{ minHeight: '94vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', padding: '2rem 2rem 4rem 2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        
        {/* Left Column: Headline and CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2.5px', color: '#999', textTransform: 'uppercase' }}>
              INDIAN RAILWAYS
            </span>
            <span style={{ width: '24px', height: '1px', background: 'var(--accent-red)' }}></span>
          </div>

          <h1 style={{ fontSize: '3.6rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-1px', color: '#ffffff' }}>
            Smarter Blocks.<br />
            Smoother <span style={{ color: 'var(--accent-red)' }}>Journeys.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#b0b0b8', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px' }}>
            AI-powered automatic block planning to maximize asset availability and ensure efficient train operations across Indian Railways.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link 
              to="/dashboard/block-planning"
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
                boxShadow: '0 4px 20px rgba(196, 30, 58, 0.45)',
                transition: 'transform 0.2s',
                textDecoration: 'none'
              }}
            >
              <span>Explore the System</span>
              <ArrowRight size={16} />
            </Link>

            <Link 
              to="/dashboard"
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
              <Play size={14} style={{ fill: '#fff' }} />
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* 3 Key Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--accent-red)' }}>↓</span> 30%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>Reduction in Delays</div>
            </div>

            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--accent-gold)' }}>↑</span> 20%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>Asset Availability</div>
            </div>

            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#4ade80' }}>↑</span> 25%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>Operational Efficiency</div>
            </div>
          </div>

        </motion.div>

        {/* Right Column: Hero Railway Viaduct Card with Telemetry Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          {/* Main Visual Box */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
            background: 'linear-gradient(180deg, #161820 0%, #0e0f14 100%)',
            height: '460px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2rem'
          }}>
            {/* Background railway bridge graphics */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(ellipse at center top, rgba(196, 30, 58, 0.18), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)',
              pointerEvents: 'none'
            }}></div>

            {/* Glowing train illustration representation */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              right: '10%',
              height: '180px',
              borderBottom: '2px solid rgba(212, 168, 71, 0.5)',
              borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
              opacity: 0.8
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                right: '25%',
                width: '120px',
                height: '24px',
                background: 'linear-gradient(90deg, var(--accent-red), #e11d48)',
                borderRadius: '6px',
                boxShadow: '0 0 25px rgba(225, 29, 72, 0.8)'
              }}>
                <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%', position: 'absolute', right: '6px', top: '9px', boxShadow: '0 0 10px #fff' }}></div>
              </div>
            </div>

            {/* Telemetry Floating Card (Matches screenshot overlay) */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'rgba(18, 20, 28, 0.88)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '1.25rem',
                maxWidth: '340px',
                zIndex: 2,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>New Delhi → Mumbai</span>
                <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                  On Time
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.4rem', fontWeight: '500' }}>
                Block Plan Optimized by AI
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div>Track Section: <strong>BSL-ET (Bhusaval - Itarsi)</strong></div>
                <div>Maintenance Window: <strong>02:00 - 04:00</strong></div>
                <div>Affected Passenger Trains: <strong style={{ color: '#4ade80' }}>0</strong></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Corridor Station Route Bar (Delhi -> Bhopal -> Nagpur -> Mumbai) */}
      <div style={{
        marginTop: '3.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {/* Train Corridor Path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, minWidth: '300px' }}>
          {['DELHI', 'BHOPAL', 'NAGPUR', 'MUMBAI'].map((stn, idx) => (
            <React.Fragment key={stn}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === 0 ? 'var(--accent-red)' : 'var(--accent-gold)' }}></div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', color: '#aaa' }}>{stn}</span>
              </div>
              {idx < 3 && (
                <div style={{ flex: 1, height: '1px', background: 'repeating-linear-gradient(90deg, #444 0px, #444 6px, transparent 6px, transparent 12px)' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Scroll To Explore Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.75rem', letterSpacing: '1px' }}>
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown size={14} className="bounce" />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
