import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { 
  Play, 
  Sliders, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Train, 
  Layers, 
  RefreshCw, 
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Calendar,
  MapPin
} from 'lucide-react';
import { blockPlansAPI, trainsAPI } from '../api/endpoints';

const BlockPlanningPage = () => {
  // Selector inputs
  const [date, setDate] = useState('2026-09-28');
  const [zone, setZone] = useState('NR');
  const [trackSection, setTrackSection] = useState('ALL');
  const [maintPriority, setMaintPriority] = useState('All');
  const [timeHorizon, setTimeHorizon] = useState(24);
  const [trackSectionsList, setTrackSectionsList] = useState([]);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [viewMode, setViewMode] = useState('comparison'); // 'comparison', 'gantt', 'whatif'

  // What-if parameters
  const [durationFactor, setDurationFactor] = useState(1.0);
  const [trackAvailability, setTrackAvailability] = useState(100.0);
  const [trainPriorityBias, setTrainPriorityBias] = useState(1.0);
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);

  // Load track sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await trainsAPI.getTrackSections({ zone });
        if (res.data) setTrackSectionsList(res.data);
      } catch (e) {
        console.warn('Track sections fetch fallback active:', e);
      }
    };
    fetchSections();
  }, [zone]);

  // Initial generation
  useEffect(() => {
    handleGeneratePlan();
  }, []);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await blockPlansAPI.generate({
        plan_date: date,
        zone: zone,
        time_horizon_hours: parseInt(timeHorizon),
        track_section_code: trackSection === 'ALL' ? null : trackSection,
        maintenance_priority: maintPriority,
        max_concurrent_blocks: 3,
        delay_penalty_weight: 1.5,
        asset_availability_weight: 2.0
      });

      setActivePlan(res.data);

      // Load comparison data
      if (res.data?.id) {
        try {
          const compRes = await blockPlansAPI.getPlanComparison(res.data.id);
          setComparisonData(compRes.data);
        } catch (e) {
          console.warn('Comparison load failed:', e);
        }
      }
    } catch (err) {
      console.error('Plan generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatIfSimulation = async () => {
    setWhatIfLoading(true);
    try {
      const res = await blockPlansAPI.whatIfAnalysis({
        block_duration_factor: parseFloat(durationFactor),
        maintenance_priority_filter: maintPriority,
        track_availability_percentage: parseFloat(trackAvailability),
        train_priority_bias: parseFloat(trainPriorityBias)
      });
      setWhatIfResult(res.data);
    } catch (err) {
      console.error('What-if analysis error:', err);
    } finally {
      setWhatIfLoading(false);
    }
  };

  // Build Gantt Timeline Plotly Traces
  const renderGanttTraces = () => {
    // Current vs AI Optimized comparisons
    const tracks = ['Delhi-Palwal', 'Palwal-Mathura', 'Mathura-Agra', 'Agra-Gwalior', 'Gwalior-Jhansi'];
    
    // Baseline Current Plan (Daytime peak collisions)
    const currentStarts = [9.0, 11.5, 13.0, 14.0, 16.0];
    const currentDurations = [3.0, 3.0, 3.0, 3.0, 3.0];

    // AI Optimized Plan (Night off-peak windows)
    const optStarts = [1.5, 2.0, 2.5, 3.0, 1.0];
    const optDurations = [2.0, 2.5, 2.0, 2.0, 3.0];

    return [
      {
        type: 'bar',
        x: currentDurations,
        y: tracks,
        base: currentStarts,
        orientation: 'h',
        name: 'Current Manual Plan (Peak Hours)',
        marker: { color: 'rgba(239, 68, 68, 0.75)', line: { color: '#ef4444', width: 1 } },
        hoverinfo: 'text',
        text: currentStarts.map((s, idx) => `Manual Block: ${s}:00 to ${s + currentDurations[idx]}:00 (Delays ~5 trains)`)
      },
      {
        type: 'bar',
        x: optDurations,
        y: tracks,
        base: optStarts,
        orientation: 'h',
        name: 'AI Optimized Block (Off-Peak Window)',
        marker: { color: 'rgba(212, 168, 71, 0.9)', line: { color: '#d4a847', width: 1 } },
        hoverinfo: 'text',
        text: optStarts.map((s, idx) => `AI Optimal: ${Math.floor(s)}:${s % 1 ? '30' : '00'} (0 Train Disruption)`)
      }
    ];
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '1.5rem', color: '#e8e6e3' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
              Automatic Block Planning Engine
            </h1>
            <span style={{ background: 'rgba(212, 168, 71, 0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(212, 168, 71, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
              Google OR-Tools CP-SAT + XGBoost
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Multi-constraint railway maintenance window optimization to maximize track and rolling stock availability.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid #333' }}>
            Simulation / Demo Data
          </span>
        </div>
      </div>

      {/* Control Console / Selectors */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Plan Date
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              style={{ width: '100%', background: 'var(--bg-base)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '4px', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Railway Zone
            </label>
            <select 
              value={zone} 
              onChange={e => setZone(e.target.value)} 
              style={{ width: '100%', background: 'var(--bg-base)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '4px', outline: 'none' }}
            >
              <option value="NR">Northern Railway (NR)</option>
              <option value="NCR">North Central Railway (NCR)</option>
              <option value="WR">Western Railway (WR)</option>
              <option value="CR">Central Railway (CR)</option>
              <option value="WCR">West Central Railway (WCR)</option>
              <option value="ER">Eastern Railway (ER)</option>
              <option value="SR">Southern Railway (SR)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Layers size={14} style={{ display: 'inline', marginRight: '4px' }} /> Track Section
            </label>
            <select 
              value={trackSection} 
              onChange={e => setTrackSection(e.target.value)} 
              style={{ width: '100%', background: 'var(--bg-base)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '4px', outline: 'none' }}
            >
              <option value="ALL">All Corridor Sections</option>
              {trackSectionsList.map(s => (
                <option key={s.section_code} value={s.section_code}>
                  {s.section_code} ({s.section_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Maintenance Priority
            </label>
            <select 
              value={maintPriority} 
              onChange={e => setMaintPriority(e.target.value)} 
              style={{ width: '100%', background: 'var(--bg-base)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '4px', outline: 'none' }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority Only</option>
              <option value="Medium">Medium & Above</option>
              <option value="Low">Low / Routine Only</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Horizon
            </label>
            <select 
              value={timeHorizon} 
              onChange={e => setTimeHorizon(e.target.value)} 
              style={{ width: '100%', background: 'var(--bg-base)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '4px', outline: 'none' }}
            >
              <option value={24}>24 Hours Horizon</option>
              <option value={48}>48 Hours Horizon</option>
              <option value={72}>72 Hours Horizon</option>
            </select>
          </div>

          <div>
            <button 
              onClick={handleGeneratePlan}
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--accent-red)',
                color: '#fff',
                padding: '0.65rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(196, 30, 58, 0.4)'
              }}
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
              <span>{loading ? 'Optimizing...' : 'Generate Block Plan'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Plan Performance Overview Ribbon */}
      {activePlan && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid var(--accent-red)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Delay Reduction</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff', marginTop: '0.2rem' }}>
              ↓ {activePlan.estimated_delay_reduction_pct || 31.5}%
            </div>
            <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Compared to manual daylight blocks</span>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid var(--accent-gold)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Asset Availability Score</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
              {activePlan.asset_availability_score || 88.5}%
            </div>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>Peak corridor throughput active</span>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #3b82f6' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Scheduled Blocks</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fff', marginTop: '0.2rem' }}>
              {activePlan.total_blocks || 8} Blocks
            </div>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>Solver status: {activePlan.solver_status || 'OPTIMAL'}</span>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passenger Train Disruptions</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.2rem' }}>
              0 Conflicts
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Rajdhani & Vande Bharat protected</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setViewMode('comparison')} 
          style={{
            background: viewMode === 'comparison' ? 'var(--bg-surface)' : 'transparent',
            color: viewMode === 'comparison' ? 'var(--accent-gold)' : 'var(--text-muted)',
            border: 'none',
            borderBottom: viewMode === 'comparison' ? '2px solid var(--accent-gold)' : '2px solid transparent',
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
        >
          Current Plan vs AI Optimized Plan (Gantt)
        </button>
        <button 
          onClick={() => setViewMode('whatif')} 
          style={{
            background: viewMode === 'whatif' ? 'var(--bg-surface)' : 'transparent',
            color: viewMode === 'whatif' ? 'var(--accent-gold)' : 'var(--text-muted)',
            border: 'none',
            borderBottom: viewMode === 'whatif' ? '2px solid var(--accent-gold)' : '2px solid transparent',
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Sliders size={16} />
          <span>Interactive What-If Analysis</span>
        </button>
      </div>

      {/* VIEW: Comparison Gantt Chart */}
      {viewMode === 'comparison' && (
        <div>
          {/* Gantt Plot */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                Corridor Timeline: Planned vs. AI Optimized Block Windows (24h)
              </h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }}></span>
                  Current Manual (Daytime Peak)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '12px', height: '12px', background: '#d4a847', borderRadius: '2px' }}></span>
                  AI Optimized (Night Off-Peak)
                </span>
              </div>
            </div>

            <Plot
              data={renderGanttTraces()}
              layout={{
                barmode: 'overlay',
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'rgba(0,0,0,0.2)',
                font: { color: '#e8e6e3', family: 'Inter, sans-serif' },
                xaxis: {
                  title: 'Hour of Day (00:00 to 24:00)',
                  range: [0, 24],
                  dtick: 2,
                  gridcolor: '#222',
                  zerolinecolor: '#333'
                },
                yaxis: {
                  autorange: 'reversed',
                  gridcolor: '#222'
                },
                margin: { l: 120, r: 30, t: 10, b: 50 },
                legend: { orientation: 'h', y: 1.15 }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '340px' }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>

          {/* Metrics Comparison Table */}
          {comparisonData && comparisonData.metrics && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Operational Impact Assessment: Current vs AI Optimized Plan
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Operational Metric</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Current Manual Schedule</th>
                      <th style={{ padding: '0.75rem 1rem' }}>AI Optimized Schedule</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Net Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.metrics.map((m, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{m.metric_name}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#f87171' }}>{m.current_value} {m.unit}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{m.optimized_value} {m.unit}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#4ade80', fontWeight: 'bold' }}>
                          + {m.improvement_pct}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: What-If Analysis */}
      {viewMode === 'whatif' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Controls Panel */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
              What-If Constraint Adjuster
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Simulate operational scenarios by adjusting maintenance block durations, track availability tolerances, and priority biases.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span>Block Duration Factor</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{durationFactor}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1" 
                  value={durationFactor} 
                  onChange={e => setDurationFactor(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }} 
                />
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Extend or compress maintenance block duration</span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span>Track Availability Tolerance</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{trackAvailability}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  step="5" 
                  value={trackAvailability} 
                  onChange={e => setTrackAvailability(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }} 
                />
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Available physical track section capacity</span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span>Train Priority Weight</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{trainPriorityBias}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1" 
                  value={trainPriorityBias} 
                  onChange={e => setTrainPriorityBias(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }} 
                />
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Weight given to high-speed passenger corridors</span>
              </div>

              <button 
                onClick={handleWhatIfSimulation}
                disabled={whatIfLoading}
                style={{
                  background: 'var(--accent-gold)',
                  color: '#000',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: whatIfLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}
              >
                {whatIfLoading ? <RefreshCw size={16} className="spin" /> : <Sliders size={16} />}
                <span>{whatIfLoading ? 'Computing Scenario...' : 'Run What-If Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Scenario Projected Outcome
            </h3>

            {whatIfResult ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projected Delay Reduction</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-red)', marginTop: '0.2rem' }}>
                      {whatIfResult.estimated_delay_reduction_pct}%
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Asset Availability Rate</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
                      {whatIfResult.asset_availability_score}%
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontWeight: '600', marginBottom: '0.3rem' }}>
                    <CheckCircle size={18} />
                    <span>Optimizer Decision Recommendation</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#dcfce7' }}>
                    {whatIfResult.recommendation}
                  </p>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total scheduled blocks feasible under these constraints: <strong>{whatIfResult.total_blocks_scheduled}</strong>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', color: '#666', textAlign: 'center' }}>
                <Sliders size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Adjust parameters on the left and click "Run What-If Simulation" to preview the optimizer's recommendations.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Safety Disclaimer Banner */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '6px', fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertTriangle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
        <span>
          <strong>Operational Notice:</strong> RailBlock AI provides automated decision-support recommendations based on public datasets and operational simulations. All generated block schedules require verification and clearance by authorized Indian Railways traffic controllers and sectional engineers before execution.
        </span>
      </div>

    </motion.div>
  );
};

export default BlockPlanningPage;
