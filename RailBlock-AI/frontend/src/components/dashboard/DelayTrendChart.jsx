import React from 'react';
import Plot from 'react-plotly.js';

const DelayTrendChart = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const layout = {
    title: {
      text: title,
      font: { color: '#e8e6e3', size: 16 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#8e8b85' },
    margin: { l: 50, r: 20, t: 40, b: 40 },
    xaxis: {
      gridcolor: '#2a2a35',
      zerolinecolor: '#2a2a35',
      title: 'Time'
    },
    yaxis: {
      gridcolor: '#2a2a35',
      zerolinecolor: '#2a2a35',
      title: 'Delay (mins)'
    },
    showlegend: true,
    legend: { x: 0, y: 1.1, orientation: 'h', font: { color: '#e8e6e3' } },
    hoverlabel: { bgcolor: '#1a1a24', font: { color: '#e8e6e3' } }
  };

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <Plot
        data={[
          {
            type: 'scatter',
            mode: 'lines+markers',
            x: data.map(d => d.date),
            y: data.map(d => d.actualDelay),
            name: 'Actual Delay',
            line: { color: 'var(--accent-red)', width: 2 },
            marker: { size: 6 }
          },
          {
            type: 'scatter',
            mode: 'lines',
            x: data.map(d => d.date),
            y: data.map(d => d.predictedDelay),
            name: 'Predicted Delay',
            line: { color: 'var(--accent-gold)', width: 2, dash: 'dot' }
          }
        ]}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default DelayTrendChart;
