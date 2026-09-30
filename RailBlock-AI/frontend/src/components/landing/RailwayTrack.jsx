import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const RailwayTrack = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Smoothly transform train position along track (top 5% to bottom 95%)
  const trainY = useTransform(scrollYProgress, [0, 1], ['40px', 'calc(100% - 80px)']);
  const [activeSection, setActiveSection] = useState(0);

  // Stations along the page journey
  const stations = [
    { id: 0, label: "Start", threshold: 0.10 },
    { id: 1, label: "The Problem", threshold: 0.25 },
    { id: 2, label: "How It Works", threshold: 0.45 },
    { id: 3, label: "Features", threshold: 0.65 },
    { id: 4, label: "Dashboard", threshold: 0.82 },
    { id: 5, label: "Destination", threshold: 0.96 }
  ];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      let current = 0;
      for (let i = 0; i < stations.length; i++) {
        if (latest >= stations[i].threshold - 0.08) {
          current = i;
        }
      }
      setActiveSection(current);
    });
    return () => unsubscribe();
  }, [scrollYProgress, shouldReduceMotion]);

  // Reduced motion: static rendering
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div 
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '24px',
        top: '80px',
        bottom: '80px',
        width: '44px',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none'
      }}
    >
      {/* Dual Steel Rails */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '28px',
        borderLeft: '3px solid #3a3d4d',
        borderRight: '3px solid #3a3d4d',
        background: `repeating-linear-gradient(
          to bottom,
          #1e2029 0px,
          #1e2029 8px,
          transparent 8px,
          transparent 24px
        )`
      }}></div>

      {/* Floating Train Engine Indicator */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          y: trainY,
          width: '32px',
          height: '52px',
          background: 'linear-gradient(180deg, var(--accent-red) 0%, #991b1b 100%)',
          borderRadius: '6px',
          boxShadow: '0 0 16px rgba(196, 30, 58, 0.7), 0 4px 10px rgba(0,0,0,0.8)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {/* Cab Window */}
        <div style={{ width: '18px', height: '10px', background: '#ffe4b5', borderRadius: '2px', boxShadow: '0 0 8px #ffe4b5', marginBottom: '6px' }}></div>
        {/* Engine Body Grille */}
        <div style={{ width: '18px', height: '2px', background: '#333', marginBottom: '2px' }}></div>
        <div style={{ width: '18px', height: '2px', background: '#333', marginBottom: '2px' }}></div>
        {/* Red Headlight */}
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff4444', marginTop: 'auto', boxShadow: '0 0 6px #ff4444' }}></div>
      </motion.div>

      {/* Railway Signal Indicators along the track */}
      {stations.map((stn, idx) => {
        // Signal logic:
        // Completed: Green
        // Current: Yellow
        // Ahead / Not reached: Red
        let signal = 'red';
        if (activeSection > idx) signal = 'green';
        else if (activeSection === idx) signal = 'yellow';

        const signalColor = signal === 'green' ? '#22c55e' : (signal === 'yellow' ? '#eab308' : '#ef4444');
        const topPos = `${(idx / (stations.length - 1)) * 92 + 4}%`;

        return (
          <div 
            key={stn.id}
            style={{
              position: 'absolute',
              top: topPos,
              left: '-14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 8
            }}
          >
            {/* Aspect Light Post */}
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: signalColor,
              boxShadow: `0 0 10px ${signalColor}`,
              border: '2px solid #111'
            }}></div>
          </div>
        );
      })}

    </div>
  );
};

export default RailwayTrack;
