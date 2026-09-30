import React from 'react';
import Plot from 'react-plotly.js';

const AssetDonutChart = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const layout = {
    title: {
      text: title,
      font: { color: '#e8e6e3', size: 16 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#8e8b85' },
    margin: { l: 20, r: 20, t: 40, b: 20 },
    showlegend: true,
    legend: { font: { color: '#e8e6e3' }, orientation: 'h', y: -0.1 },
    hoverlabel: { bgcolor: '#1a1a24', font: { color: '#e8e6e3' } }
  };

  const colors = ['#4caf50', 'var(--accent-gold)', 'var(--accent-red)', '#2196f3', '#9c27b0'];

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Plot
        data={[
          {
            type: 'pie',
            hole: 0.6,
            labels: data.map(d => d.label),
            values: data.map(d => d.value),
            marker: { colors: colors.slice(0, data.length) },
            textinfo: 'percent',
            hoverinfo: 'label+value+percent'
          }
        ]}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AssetDonutChart;
