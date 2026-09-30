import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { BarChart3, TrendingDown, Activity, Layers, RefreshCw, ArrowUpRight } from 'lucide-react';
import { analyticsAPI } from '../api/endpoints';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getOverview();
      setAnalytics(res.data);
    } catch (e) {
      console.warn('Analytics fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const zones = ['Northern', 'Western', 'Central', 'North Central', 'Eastern', 'Southern', 'South Central', 'West Central'];
  const zoneThroughputs = [86.4, 84.2, 89.1, 92.5, 79.8, 81.3, 83.0, 87.6];
  const delayHours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  const manualDelays = [8.5, 6.2, 14.5, 32.1, 22.6, 26.3, 36.8, 20.4];
  const aiDelays = [2.5, 1.8, 4.2, 9.4, 6.5, 8.0, 10.2, 6.0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '1.5rem', color: '#e8e6e3' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
            Operational Analytics & Telemetry
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Longitudinal corridor performance metrics, AI delay reduction telemetry, and zonal capacity utilization.
          </p>
        </div>

        <button 
          onClick={fetchData}
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.45rem 0.9rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid var(--accent-red)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delay Reduction Impact</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-red)', margin: '0.3rem 0' }}>
            ↓ 31.5%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Across 19 tracked corridors</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid var(--accent-gold)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Corridor Throughput</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-gold)', margin: '0.3rem 0' }}>
            + 27.0%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>94 trains/day capacity</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Asset Availability Gain</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: '0.3rem 0' }}>
            + 20.5%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#888' }}>88.5% total network readiness</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passenger On-Time Reliability</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', margin: '0.3rem 0' }}>
            94.8%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Superfast & Express trains</span>
        </div>
      </div>

      {/* Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Chart 1: Delay Reduction Comparison */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            24h Corridor Delay: Current Manual vs AI-Optimized Block Schedule
          </h3>
          <Plot
            data={[
              {
                x: delayHours,
                y: manualDelays,
                type: 'bar',
                name: 'Current Manual Schedule',
                marker: { color: 'rgba(239, 68, 68, 0.75)' }
              },
              {
                x: delayHours,
                y: aiDelays,
                type: 'bar',
                name: 'AI Optimized Schedule',
                marker: { color: 'rgba(212, 168, 71, 0.9)' }
              }
            ]}
            layout={{
              barmode: 'group',
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(0,0,0,0.2)',
              font: { color: '#e8e6e3', family: 'Inter, sans-serif' },
              xaxis: { gridcolor: '#222' },
              yaxis: { title: 'Average Delay (min)', gridcolor: '#222' },
              margin: { l: 50, r: 20, t: 10, b: 40 },
              legend: { orientation: 'h', y: 1.15 }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '300px' }}
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>

        {/* Chart 2: Zone Capacity Utilization */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Zonal Railway Corridor Capacity Utilization (%)
          </h3>
          <Plot
            data={[
              {
                x: zones,
                y: zoneThroughputs,
                type: 'bar',
                marker: {
                  color: ['#c41e3a', '#d4a847', '#3b82f6', '#10b981', '#a78bfa', '#f59e0b', '#06b6d4', '#ec4899']
                }
              }
            ]}
            layout={{
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(0,0,0,0.2)',
              font: { color: '#e8e6e3', family: 'Inter, sans-serif' },
              xaxis: { gridcolor: '#222', tickangle: -25 },
              yaxis: { title: 'Utilization %', range: [50, 100], gridcolor: '#222' },
              margin: { l: 45, r: 20, t: 10, b: 60 }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '300px' }}
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>

      </div>

    </motion.div>
  );
};

export default AnalyticsPage;
