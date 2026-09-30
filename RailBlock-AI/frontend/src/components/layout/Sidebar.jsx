import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Calendar, 
  Zap, 
  Train, 
  Wrench, 
  ShieldAlert, 
  Activity, 
  Database, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 size={18} /> },
    { name: 'Block Planning', path: '/dashboard/block-planning', icon: <Calendar size={18} /> },
    { name: 'Train Schedules', path: '/dashboard/trains', icon: <Train size={18} /> },
    { name: 'Asset Availability', path: '/dashboard/assets', icon: <Zap size={18} /> },
    { name: 'Maintenance', path: '/dashboard/maintenance', icon: <Wrench size={18} /> },
    { name: 'Conflicts & Alerts', path: '/dashboard/alerts', icon: <ShieldAlert size={18} /> },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <Activity size={18} /> },
    { name: 'Data & Engine Status', path: '/dashboard/data-status', icon: <Database size={18} /> },
    { name: 'Reports', path: '/dashboard/reports', icon: <FileText size={18} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ width: 250 }}
      animate={{ width: isOpen ? 250 : 75 }}
      transition={{ duration: 0.25 }}
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 50,
        height: '100vh'
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', borderBottom: '1px solid var(--border-color)' }}>
        {isOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '1.15rem' }}>
            <Train size={20} />
            <span style={{ color: '#fff' }}>RailBlock <span style={{ color: 'var(--accent-red)' }}>AI</span></span>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '0.2rem' }}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      
      {/* Nav List */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(196, 30, 58, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(196, 30, 58, 0.4)' : '1px solid transparent',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '0.85rem',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  gap: isOpen ? '0.75rem' : '0'
                })}
              >
                <span>{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User / Logout Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {isOpen && (
          <div style={{ fontSize: '0.75rem', color: '#888' }}>
            <div style={{ color: '#fff', fontWeight: 'bold' }}>{user?.username || 'Novaa_x'}</div>
            <div>{user?.role || 'Chief Controller'}</div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888',
            display: 'flex',
            alignItems: 'center',
            gap: isOpen ? '0.5rem' : '0',
            padding: '0.4rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            justifyContent: isOpen ? 'flex-start' : 'center'
          }}
        >
          <LogOut size={16} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
