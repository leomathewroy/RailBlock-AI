import React from 'react';
import Plot from 'react-plotly.js';

const GanttChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No schedule data available</div>;
  }

  const yAxis = data.map(d => d.taskName);
  const startDates = data.map(d => new Date(d.startTime).getTime());
  const durations = data.map(d => new Date(d.endTime).getTime() - new Date(d.startTime).getTime());
  const colors = data.map(d => d.status === 'Completed' ? '#4caf50' : d.status === 'In Progress' ? 'var(--accent-gold)' : 'var(--text-muted)');

  const layout = {
    title: {
      text: title,
      font: { color: '#e8e6e3', size: 16 }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#8e8b85' },
    margin: { l: 150, r: 20, t: 40, b: 40 },
    xaxis: {
      type: 'date',
      gridcolor: '#2a2a35',
      zerolinecolor: '#2a2a35',
    },
    yaxis: {
      autorange: 'reversed',
      gridcolor: '#2a2a35',
      zerolinecolor: '#2a2a35',
    },
    barmode: 'stack',
    showlegend: false,
    hoverlabel: { bgcolor: '#1a1a24', font: { color: '#e8e6e3' } }
  };

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <Plot
        data={[
          {
            type: 'bar',
            x: startDates,
            y: yAxis,
            orientation: 'h',
            marker: { color: 'rgba(0,0,0,0)' },
            hoverinfo: 'none'
          },
          {
            type: 'bar',
            x: durations,
            y: yAxis,
            orientation: 'h',
            marker: { color: colors },
            text: data.map(d => `${d.status}`),
            hovertemplate: '%{y}<br>Status: %{text}<extra></extra>'
          }
        ]}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default GanttChart;
