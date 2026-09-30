import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Train, Clock, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { trainsAPI, predictionsAPI } from '../api/endpoints';

const TrainSchedulePage = () => {
  const [trains, setTrains] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('ALL');
  const [trainType, setTrainType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [delayPrediction, setDelayPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchTrains();
  }, [page, zone, trainType]);

  const fetchTrains = async () => {
    setLoading(true);
    try {
      const res = await trainsAPI.getTrains({
        page,
        size: 15,
        search: search.trim() || undefined,
        zone: zone === 'ALL' ? undefined : zone,
        train_type: trainType === 'ALL' ? undefined : trainType
      });
      setTrains(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.total_pages || 1);
    } catch (e) {
      console.warn('Trains fetch fallback active:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTrains();
  };

  const handlePredictDelay = async (train) => {
    setSelectedTrain(train);
    setPredicting(true);
    setDelayPrediction(null);
    try {
      const res = await predictionsAPI.predictDelay({
        train_number: train.train_number,
        station_code: train.from_station_code || 'NDLS',
        scheduled_hour: parseInt(train.departure_time?.split(':')[0] || '10'),
        day_of_week: new Date().getDay(),
        month: new Date().getMonth() + 1,
        distance_km: train.distance_km || 500.0,
        train_type: train.train_type || 'Superfast'
      });
      setDelayPrediction(res.data);
    } catch (e) {
      console.error('Delay prediction error:', e);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '1.5rem', color: '#e8e6e3' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
            Train Operations & Schedules
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Ingested from public Indian Railways dataset. Real-time timetable querying and ML delay prediction.
          </p>
        </div>

        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid #333' }}>
          Dataset: Indian Railways Dataset (5,208 Trains)
        </span>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              placeholder="Search train name or number (e.g. 12301, Rajdhani)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-base)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <Search size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#777' }} />
          </div>

          <div>
            <select 
              value={zone} 
              onChange={e => { setZone(e.target.value); setPage(1); }}
              style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.6rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="ALL">All Railway Zones</option>
              <option value="NR">Northern (NR)</option>
              <option value="NCR">North Central (NCR)</option>
              <option value="WR">Western (WR)</option>
              <option value="CR">Central (CR)</option>
              <option value="ER">Eastern (ER)</option>
              <option value="SR">Southern (SR)</option>
              <option value="SCR">South Central (SCR)</option>
              <option value="WCR">West Central (WCR)</option>
            </select>
          </div>

          <div>
            <select 
              value={trainType} 
              onChange={e => { setTrainType(e.target.value); setPage(1); }}
              style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.6rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="ALL">All Train Types</option>
              <option value="Rajdhani">Rajdhani Express</option>
              <option value="Shatabdi">Shatabdi Express</option>
              <option value="Vande">Vande Bharat Express</option>
              <option value="Duronto">Duronto Express</option>
              <option value="Superfast">Superfast Express</option>
              <option value="Mail">Mail / Express</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="submit"
              style={{
                flex: 1,
                background: 'var(--accent-red)',
                color: '#fff',
                padding: '0.6rem 1rem',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Filter
            </button>
            <button 
              type="button"
              onClick={() => { setSearch(''); setZone('ALL'); setTrainType('ALL'); setPage(1); }}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: '#aaa',
                padding: '0.6rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Reset
            </button>
          </div>

        </form>
      </div>

      {/* Main Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Train No.</th>
                <th style={{ padding: '0.85rem 1rem' }}>Train Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Zone</th>
                <th style={{ padding: '0.85rem 1rem' }}>Route</th>
                <th style={{ padding: '0.85rem 1rem' }}>Departure</th>
                <th style={{ padding: '0.85rem 1rem' }}>Arrival</th>
                <th style={{ padding: '0.85rem 1rem' }}>Distance</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>ML Predict</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    <RefreshCw size={20} className="spin" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div>Loading Indian Railways train records...</div>
                  </td>
                </tr>
              ) : trains.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    No train records matching the selected query.
                  </td>
                </tr>
              ) : (
                trains.map(t => (
                  <tr key={t.train_number} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                      {t.train_number}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '500', color: '#fff' }}>
                      {t.train_name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '0.75rem',
                        background: t.train_type?.includes('Rajdhani') ? 'rgba(196,30,58,0.2)' : 'rgba(255,255,255,0.06)',
                        color: t.train_type?.includes('Rajdhani') ? 'var(--accent-red)' : '#ccc'
                      }}>
                        {t.train_type || 'Superfast'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#888' }}>
                      {t.zone || 'NR'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#aaa' }}>
                      {t.from_station_code || 'NDLS'} → {t.to_station_code || 'HWH'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {t.departure_time || '10:00'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {t.arrival_time || '18:30'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#888' }}>
                      {t.distance_km ? `${t.distance_km} km` : 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handlePredictDelay(t)}
                        style={{
                          background: 'rgba(212, 168, 71, 0.15)',
                          border: '1px solid rgba(212, 168, 71, 0.4)',
                          color: 'var(--accent-gold)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        Predict Delay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total trains)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(p => p - 1)}
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delay Prediction Modal / Flyout */}
      {selectedTrain && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} style={{ color: 'var(--accent-gold)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                XGBoost Delay Prediction: {selectedTrain.train_number} - {selectedTrain.train_name}
              </h3>
            </div>
            <button onClick={() => setSelectedTrain(null)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>

          {predicting ? (
            <div style={{ color: '#888', fontSize: '0.85rem' }}>Calculating predictive inference...</div>
          ) : delayPrediction ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#888' }}>Expected Delay:</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: delayPrediction.predicted_delay_minutes > 30 ? 'var(--accent-red)' : 'var(--accent-gold)' }}>
                  {delayPrediction.predicted_delay_minutes} min
                </div>
              </div>
              <div>
                <span style={{ color: '#888' }}>Category:</span>
                <div style={{ fontWeight: '600', color: '#fff' }}>{delayPrediction.delay_category}</div>
              </div>
              <div>
                <span style={{ color: '#888' }}>Confidence:</span>
                <div style={{ fontWeight: '600', color: '#4ade80' }}>{(delayPrediction.confidence_score * 100).toFixed(0)}%</div>
              </div>
              <div>
                <span style={{ color: '#888' }}>Model Version:</span>
                <div style={{ color: '#aaa' }}>{delayPrediction.model_version}</div>
              </div>
            </div>
          ) : null}
        </div>
      )}

    </motion.div>
  );
};

export default TrainSchedulePage;
