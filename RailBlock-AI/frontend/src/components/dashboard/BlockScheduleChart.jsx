import React from 'react';
import Plot from 'react-plotly.js';

const BlockScheduleChart = ({ data, title }) => {
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
    barmode: 'group',
    xaxis: {
      gridcolor: '#2a2a35',
      zerolinecolor: '#2a2a35',
      title: 'Section'
    },
    yaxis: {
      gridcolor: '#2a2a35',
      zerolinecolor: '#2a2a35',
      title: 'Hours'
    },
    showlegend: true,
    legend: { orientation: 'h', y: -0.2, font: { color: '#e8e6e3' } },
    hoverlabel: { bgcolor: '#1a1a24', font: { color: '#e8e6e3' } }
  };

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <Plot
        data={[
          {
            type: 'bar',
            x: data.map(d => d.section),
            y: data.map(d => d.plannedHours),
            name: 'Planned',
            marker: { color: '#2196f3' }
          },
          {
            type: 'bar',
            x: data.map(d => d.section),
            y: data.map(d => d.actualHours),
            name: 'Actual',
            marker: { color: 'var(--accent-gold)' }
          }
        ]}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default BlockScheduleChart;
