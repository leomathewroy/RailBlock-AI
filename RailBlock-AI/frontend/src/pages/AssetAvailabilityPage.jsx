import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { Zap, Layers, Activity, ShieldCheck, Filter, AlertTriangle, RefreshCw, Wrench } from 'lucide-react';
import { assetsAPI, predictionsAPI } from '../api/endpoints';

const AssetAvailabilityPage = () => {
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [assetType, setAssetType] = useState('ALL');
  const [assetStatus, setAssetStatus] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Risk prediction state
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [predictingRisk, setPredictingRisk] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [page, assetType, assetStatus]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await assetsAPI.getAssets({
        page,
        size: 12,
        asset_type: assetType === 'ALL' ? undefined : assetType,
        asset_status: assetStatus === 'ALL' ? undefined : assetStatus
      });
      setAssets(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.total_pages || 1);
      if (res.data.summary) setSummary(res.data.summary);
    } catch (e) {
      console.warn('Assets fetch fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictRisk = async (asset) => {
    setSelectedAsset(asset);
    setPredictingRisk(true);
    setRiskData(null);
    try {
      const res = await predictionsAPI.predictAssetRisk({
        asset_code: asset.asset_code,
        asset_type: asset.asset_type,
        utilization_rate: asset.utilization_rate || 80.0,
        days_since_maintenance: 42,
        health_score: asset.health_score || 90.0
      });
      setRiskData(res.data);
    } catch (e) {
      console.error('Asset risk prediction error:', e);
    } finally {
      setPredictingRisk(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '1.5rem', color: '#e8e6e3' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
            Rolling Stock & Infrastructure Asset Availability
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Telemetry monitoring of Locomotives, Coaches, Track Segments, and Electronic Interlocking units.
          </p>
        </div>

        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid #333' }}>
          Simulated Asset Availability (Demo Data)
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Available Locomotives</span>
            <Zap size={18} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.4rem 0', color: 'var(--accent-gold)' }}>
            {summary?.available_locomotives || 412} <span style={{ fontSize: '0.9rem', color: '#777' }}>/ {summary?.total_locomotives || 480}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>85.8% Ready for Dispatch</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid #a78bfa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Available Coaches</span>
            <Layers size={18} style={{ color: '#a78bfa' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.4rem 0' }}>
            {summary?.available_coaches || 3150} <span style={{ fontSize: '0.9rem', color: '#777' }}>/ {summary?.total_coaches || 3600}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>87.5% in service</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Operational Tracks</span>
            <Activity size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.4rem 0' }}>
            {summary?.track_sections_operational || 184} <span style={{ fontSize: '0.9rem', color: '#777' }}>/ {summary?.total_track_sections || 198}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>14 Under Block Possession</span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Mean Health Score</span>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.4rem 0', color: '#10b981' }}>
            {summary?.average_health_score || 93.6}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#888' }}>Avg Utilization: {summary?.average_utilization_rate || 82.4}%</span>
        </div>

      </div>

      {/* Filter Bar */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>Asset Type</label>
          <select 
            value={assetType}
            onChange={e => { setAssetType(e.target.value); setPage(1); }}
            style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.55rem', color: '#fff', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Asset Types</option>
            <option value="Locomotive">Locomotives</option>
            <option value="Coach">Coaches</option>
            <option value="Track">Track Segments</option>
            <option value="Signalling Equipment">Signalling Units</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>Operational Status</label>
          <select 
            value={assetStatus}
            onChange={e => { setAssetStatus(e.target.value); setPage(1); }}
            style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.55rem', color: '#fff', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {assets.map(asset => (
          <div 
            key={asset.asset_code}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{asset.asset_code}</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fff', marginTop: '0.1rem' }}>{asset.asset_name}</h4>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: asset.asset_status === 'Available' ? 'rgba(74, 222, 128, 0.15)' : (asset.asset_status === 'In Use' ? 'rgba(96, 165, 250, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                color: asset.asset_status === 'Available' ? '#4ade80' : (asset.asset_status === 'In Use' ? '#60a5fa' : '#f87171')
              }}>
                {asset.asset_status}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.75rem' }}>
              <div>Type: <strong>{asset.asset_type}</strong></div>
              <div>Home Depot: <strong>{asset.home_depot || 'New Delhi Depot'}</strong></div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                <span>Health Score: <strong>{asset.health_score}%</strong></span>
                <span>Utilization: <strong>{asset.utilization_rate}%</strong></span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${asset.health_score}%`, height: '100%', background: asset.health_score > 85 ? '#4ade80' : 'var(--accent-gold)' }}></div>
              </div>
            </div>

            <button 
              onClick={() => handlePredictRisk(asset)}
              style={{
                marginTop: '0.75rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.4rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Assess Predictive Risk
            </button>
          </div>
        ))}
      </div>

      {/* Asset Risk Assessment Modal */}
      {selectedAsset && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid var(--accent-red)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              ML Operational Risk Analysis: {selectedAsset.asset_code}
            </h3>
            <button onClick={() => setSelectedAsset(null)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>✕</button>
          </div>

          {predictingRisk ? (
            <div style={{ color: '#888', fontSize: '0.85rem' }}>Computing failure probability...</div>
          ) : riskData ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#888' }}>Failure Probability:</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: riskData.failure_risk_probability > 0.5 ? '#f87171' : '#4ade80' }}>
                  {(riskData.failure_risk_probability * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span style={{ color: '#888' }}>Recommended Window:</span>
                <div style={{ fontWeight: 'bold', color: '#fff' }}>Within {riskData.recommended_maintenance_window_days} days</div>
              </div>
              <div>
                <span style={{ color: '#888' }}>Prescriptive Action:</span>
                <div style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>{riskData.recommended_action}</div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>Page {page} of {totalPages} ({total} assets)</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
        </div>
      </div>

    </motion.div>
  );
};

export default AssetAvailabilityPage;
