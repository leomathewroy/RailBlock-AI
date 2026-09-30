import React from 'react';
import { Link } from 'react-router-dom';
import { Train, ArrowRight } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem 2.5rem',
      position: 'relative',
      zIndex: 100,
      background: 'transparent'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-red)', textDecoration: 'none' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'var(--accent-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <Train size={18} />
        </div>
        <span style={{ color: '#fff', letterSpacing: '-0.5px' }}>RailBlock <span style={{ color: 'var(--accent-red)' }}>AI</span></span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem' }}>
        <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500', borderBottom: '2px solid var(--accent-red)', paddingBottom: '2px' }}>Home</a>
        <a href="#problem" style={{ color: '#aaa', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Problem</a>
        <a href="#solution" style={{ color: '#aaa', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Solution</a>
        <a href="#features" style={{ color: '#aaa', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Features</a>
        <Link to="/dashboard" style={{ color: '#aaa', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
        <Link to="/dashboard/data-status" style={{ color: '#aaa', textDecoration: 'none', fontWeight: '500' }}>About</Link>
      </div>

      {/* Get Started CTA */}
      <div>
        <Link 
          to="/login"
          style={{
            background: 'var(--accent-red)',
            color: '#fff',
            padding: '0.6rem 1.3rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(196, 30, 58, 0.4)'
          }}
        >
          <span>Get Started</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
