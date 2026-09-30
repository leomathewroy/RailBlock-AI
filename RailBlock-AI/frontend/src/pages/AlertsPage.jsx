import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../api/endpoints';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getAlerts();
      setAlerts(res.data?.alerts || []);
    } catch (e) {
      console.warn('Alerts fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_resolved: true } : a));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '1.5rem', color: '#e8e6e3' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
            Operational Conflicts & Safety Alerts
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Continuous monitoring of timetable collisions, maintenance overlaps, and cascading delay risks.
          </p>
        </div>

        <button 
          onClick={fetchAlerts}
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.45rem 0.9rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Refresh Alerts</span>
        </button>
      </div>

      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.map(a => {
          const isCrit = a.severity === 'Critical';
          const isWarn = a.severity === 'Warning';
          const borderColor = a.is_resolved ? '#4ade80' : (isCrit ? 'var(--accent-red)' : 'var(--accent-gold)');

          return (
            <div 
              key={a.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderLeft: `5px solid ${borderColor}`,
                borderRadius: '8px',
                padding: '1.25rem',
                opacity: a.is_resolved ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {isCrit ? <AlertCircle size={20} style={{ color: 'var(--accent-red)' }} /> : (isWarn ? <AlertTriangle size={20} style={{ color: 'var(--accent-gold)' }} /> : <Info size={20} style={{ color: '#60a5fa' }} />)}
                  <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>{a.title}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '3px',
                    background: a.is_resolved ? 'rgba(74,222,128,0.2)' : (isCrit ? 'rgba(239,68,68,0.2)' : 'rgba(212,168,71,0.2)'),
                    color: a.is_resolved ? '#4ade80' : (isCrit ? '#f87171' : 'var(--accent-gold)')
                  }}>
                    {a.is_resolved ? 'RESOLVED' : a.severity}
                  </span>
                </div>

                {!a.is_resolved && (
                  <button 
                    onClick={() => handleResolve(a.id)}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
                {a.message}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#4ade80' }}>
                  <strong>Recommendation:</strong> {a.recommendation}
                </span>

                <Link 
                  to="/dashboard/block-planning"
                  style={{
                    color: 'var(--accent-gold)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Resolve in Optimizer</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </motion.div>
  );
};

export default AlertsPage;
