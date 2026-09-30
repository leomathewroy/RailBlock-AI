import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { 
  Train, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Zap, 
  Layers, 
  Wrench, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { analyticsAPI, blockPlansAPI } from '../api/endpoints';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, alertsRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getAlerts()
      ]);
      setAnalytics(overviewRes.data);
      setAlerts(alertsRes.data?.alerts || []);
    } catch (e) {
      console.warn('Dashboard fetch fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  // Safe metrics fallbacks
  const data = analytics || {
    total_trains: 1248,
    available_locomotives: 412,
    total_locomotives: 480,
    available_coaches: 3150,
    total_coaches: 3600,
    active_maintenance_blocks: 23,
    average_delay_minutes: 18.4,
    asset_utilization_pct: 82.0,
    conflicts_detected: 3,
    hourly_delay_trend: [
      { label: '00:00', value: 8.5 },
      { label: '04:00', value: 7.0 },
      { label: '08:00', value: 28.4 },
      { label: '12:00', value: 22.6 },
      { label: '16:00', value: 26.3 },
      { label: '20:00', value: 31.2 },
      { label: '23:00', value: 12.1 }
    ],
    asset_availability_by_category: {
      Locomotives: 85.8,
      Coaches: 87.5,
      Tracks: 92.9,
      Signalling: 96.5
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '1.5rem', color: '#e8e6e3' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            Railway Operations Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time block planning telemetry and AI optimization metrics across Indian Railways.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid #333' }}>
            Simulation / Demo Data
          </span>
          <button 
            onClick={fetchDashboardData}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards (7 Core Metrics) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Card 1: Total Trains */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Total Trains</span>
            <Train size={18} style={{ color: '#60a5fa' }} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', margin: '0.4rem 0 0.2rem 0' }}>
            {data.total_trains?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={14} /> +3.5% vs last week
          </div>
        </div>

        {/* Card 2: Available Locomotives */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Available Locos</span>
            <Zap size={18} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', margin: '0.4rem 0 0.2rem 0', color: 'var(--accent-gold)' }}>
            {data.available_locomotives} <span style={{ fontSize: '0.9rem', color: '#777' }}>/ {data.total_locomotives}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={14} /> +6.1% availability
          </div>
        </div>

        {/* Card 3: Available Coaches */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Available Coaches</span>
            <Layers size={18} style={{ color: '#a78bfa' }} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', margin: '0.4rem 0 0.2rem 0' }}>
            {data.available_coaches?.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#777' }}>/ {data.total_coaches?.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={14} /> 87.5% in service
          </div>
        </div>

        {/* Card 4: Active Maintenance Blocks */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', borderLeft: '3px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Active Blocks</span>
            <Wrench size={18} style={{ color: 'var(--accent-red)' }} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', margin: '0.4rem 0 0.2rem 0', color: 'var(--accent-red)' }}>
            {data.active_maintenance_blocks}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowDownRight size={14} /> -12% disruption
          </div>
        </div>

        {/* Card 5: Average Delay */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Average Delay</span>
            <Clock size={18} style={{ color: '#fb923c' }} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', margin: '0.4rem 0 0.2rem 0' }}>
            {data.average_delay_minutes} <span style={{ fontSize: '0.9rem', color: '#777' }}>min</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowDownRight size={14} /> -35% vs baseline
          </div>
        </div>

        {/* Card 6: Asset Utilization */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Asset Utilization</span>
            <Activity size={18} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', margin: '0.4rem 0 0.2rem 0', color: '#34d399' }}>
            {data.asset_utilization_pct}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={14} /> Optimal band
          </div>
        </div>

        {/* Card 7: Conflicts Detected */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Conflicts Detected</span>
            <ShieldAlert size={18} style={{ color: '#f87171' }} />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', margin: '0.4rem 0 0.2rem 0', color: '#f87171' }}>
            {data.conflicts_detected}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
            AI resolution available
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Chart 1: Delay Trends */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>
              Corridor Delay Profile (24h Trend)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Peak vs Off-Peak</span>
          </div>
          <Plot
            data={[
              {
                x: data.hourly_delay_trend.map(d => d.label),
                y: data.hourly_delay_trend.map(d => d.value),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Observed Delay',
                line: { color: 'var(--accent-red)', width: 3 },
                marker: { size: 6, color: 'var(--accent-red)' }
              },
              {
                x: data.hourly_delay_trend.map(d => d.label),
                y: data.hourly_delay_trend.map(d => d.secondary_value || (d.value * 0.3)),
                type: 'scatter',
                mode: 'lines',
                name: 'AI Optimized Target',
                line: { color: 'var(--accent-gold)', width: 2, dash: 'dot' }
              }
            ]}
            layout={{
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(0,0,0,0.2)',
              font: { color: '#e8e6e3', family: 'Inter, sans-serif' },
              xaxis: { gridcolor: '#222' },
              yaxis: { title: 'Delay (min)', gridcolor: '#222' },
              margin: { l: 45, r: 20, t: 10, b: 40 },
              legend: { orientation: 'h', y: 1.15 }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '280px' }}
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>

        {/* Chart 2: Asset Availability Donut */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>
              Asset Availability Breakdown
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Overall: 88.5% Available</span>
          </div>
          <Plot
            data={[
              {
                values: [
                  data.asset_availability_by_category?.Locomotives || 85.8,
                  data.asset_availability_by_category?.Coaches || 87.5,
                  data.asset_availability_by_category?.Tracks || 92.9,
                  data.asset_availability_by_category?.Signalling || 96.5
                ],
                labels: ['Locomotives', 'Coaches', 'Track Segments', 'Signalling Units'],
                type: 'pie',
                hole: 0.6,
                marker: {
                  colors: ['#c41e3a', '#d4a847', '#3b82f6', '#10b981']
                },
                textinfo: 'label+percent',
                insidetextorientation: 'radial'
              }
            ]}
            layout={{
              paper_bgcolor: 'transparent',
              font: { color: '#e8e6e3', family: 'Inter, sans-serif' },
              margin: { l: 20, r: 20, t: 10, b: 20 },
              showlegend: false
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '280px' }}
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>

      </div>

      {/* Critical Conflict / Alert Feed */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ color: 'var(--accent-red)' }} />
            <span>Active Operational Conflicts & Warnings</span>
          </h3>
          <Link to="/dashboard/block-planning" style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Resolve in Block Planning</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alerts.map((alt) => (
            <div 
              key={alt.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                background: 'var(--bg-base)',
                border: '1px solid var(--border-color)',
                padding: '0.85rem 1rem',
                borderRadius: '6px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    background: alt.severity === 'Critical' ? 'rgba(239,68,68,0.2)' : 'rgba(212,168,71,0.2)',
                    color: alt.severity === 'Critical' ? '#f87171' : 'var(--accent-gold)'
                  }}>
                    {alt.severity}
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{alt.title}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{alt.message}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>
                  Recommendation: {alt.recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default DashboardOverview;
