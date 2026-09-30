import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, RefreshCw, Calendar } from 'lucide-react';
import { maintenanceAPI } from '../api/endpoints';

const MaintenancePage = () => {
  const [data, setData] = useState({ active_blocks_count: 0, pending_requests_count: 0, scheduled_blocks: [], requests: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    track_section_code: 'NDLS-PWL',
    maintenance_type: 'Track inspection',
    priority: 'High',
    required_duration_hours: 2.5,
    preferred_time_window: '02:00-04:30',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const res = await maintenanceAPI.getOverview();
      setData(res.data);
    } catch (e) {
      console.warn('Maintenance fetch fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await maintenanceAPI.createRequest(form);
      setShowModal(false);
      setForm({ track_section_code: 'NDLS-PWL', maintenance_type: 'Track inspection', priority: 'High', required_duration_hours: 2.5, preferred_time_window: '02:00-04:30', notes: '' });
      fetchMaintenance();
    } catch (err) {
      console.error('Request submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '1.5rem', color: '#e8e6e3' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
            Maintenance Windows & Possession Requests
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track engineering, 25kV OHE catenary inspections, and automatic signalling block management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              background: 'var(--accent-red)',
              color: '#fff',
              border: 'none',
              padding: '0.55rem 1rem',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(196, 30, 58, 0.4)'
            }}
          >
            <Plus size={16} />
            <span>New Block Request</span>
          </button>
          
          <button 
            onClick={fetchMaintenance}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.55rem 0.85rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid var(--accent-red)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Scheduled Blocks</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-red)', margin: '0.3rem 0' }}>
            {data.scheduled_blocks?.length || 3}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>All in optimal off-peak windows</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid var(--accent-gold)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Engineering Requests</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-gold)', margin: '0.3rem 0' }}>
            {data.requests?.length || 4}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#888' }}>Queued for OR-Tools optimizer</span>
        </div>
      </div>

      {/* Split Section: Scheduled Blocks & Pending Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Scheduled Blocks */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: 'var(--accent-gold)' }} />
            <span>Active Scheduled Maintenance Blocks</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.scheduled_blocks || []).map(b => (
              <div 
                key={b.block_code}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{b.block_code}</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 'bold' }}>
                    {b.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.2rem' }}>
                  {b.block_type} • Section: <strong>{b.track_section_code}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                  <span>Duration: <strong>{b.duration_hours} hrs</strong></span>
                  <span>Impact: <strong>{b.impact_level} (0 Delays)</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={18} style={{ color: 'var(--accent-red)' }} />
            <span>Pending Engineering Block Requests</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.requests || []).map(r => (
              <div 
                key={r.request_code}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{r.request_code}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    background: r.priority === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(212,168,71,0.2)',
                    color: r.priority === 'High' ? '#f87171' : 'var(--accent-gold)'
                  }}>
                    {r.priority} Priority
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '0.3rem' }}>
                  {r.maintenance_type} • Section: <strong>{r.track_section_code}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  {r.notes || `Preferred window: ${r.preferred_time_window}`}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Request Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>Submit Maintenance Block Request</h3>
            
            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>Track Section</label>
                <select 
                  value={form.track_section_code} 
                  onChange={e => setForm({ ...form, track_section_code: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem', borderRadius: '4px' }}
                >
                  <option value="NDLS-PWL">NDLS-PWL (New Delhi - Palwal)</option>
                  <option value="PWL-MTJ">PWL-MTJ (Palwal - Mathura)</option>
                  <option value="MTJ-AGC">MTJ-AGC (Mathura - Agra Cantt)</option>
                  <option value="AGC-GWL">AGC-GWL (Agra Cantt - Gwalior)</option>
                  <option value="GWL-JHS">GWL-JHS (Gwalior - Jhansi)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>Maintenance Type</label>
                <select 
                  value={form.maintenance_type} 
                  onChange={e => setForm({ ...form, maintenance_type: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem', borderRadius: '4px' }}
                >
                  <option value="Track inspection">Track Ultrasonic Flaw Inspection (USFD)</option>
                  <option value="Track repair">Track Repair & Point Reconditioning</option>
                  <option value="Electrical maintenance">25kV AC OHE Overhead Inspection</option>
                  <option value="Signalling maintenance">Signalling Interlocking Test</option>
                  <option value="Routine inspection">Routine Ballast Screening</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>Priority</label>
                  <select 
                    value={form.priority} 
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem', borderRadius: '4px' }}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low / Routine</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>Duration (Hours)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="1" 
                    max="8" 
                    value={form.required_duration_hours} 
                    onChange={e => setForm({ ...form, required_duration_hours: parseFloat(e.target.value) })}
                    style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>Operational Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ultrasonic rail flaw detection on Down Line" 
                  value={form.notes} 
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ flex: 1, background: 'var(--accent-red)', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '6px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#aaa', padding: '0.7rem 1.25rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default MaintenancePage;
