import React from 'react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '20px', color: '#e8e6e3' }}>
      <h1>Settings</h1>
      <form style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px', background: '#1a1a24', padding: '25px', borderRadius: '8px', border: '1px solid #333' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Theme Preference</label>
          <select style={{ width: '100%', padding: '10px', background: '#0a0a0f', color: '#e8e6e3', border: '1px solid #444', borderRadius: '4px' }}>
            <option>Dark Theme (Default)</option>
            <option>Light Theme</option>
            <option>System Default</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Notification Channels</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#c41e3a' }} /> Email
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#c41e3a' }} /> SMS Alerts
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" style={{ accentColor: '#c41e3a' }} /> Push Notifications
            </label>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Timezone</label>
          <select style={{ width: '100%', padding: '10px', background: '#0a0a0f', color: '#e8e6e3', border: '1px solid #444', borderRadius: '4px' }}>
            <option>Asia/Kolkata (IST)</option>
            <option>UTC</option>
          </select>
        </div>
        <button type="button" style={{ background: '#c41e3a', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>Save Changes</button>
      </form>
    </motion.div>
  );
};

export default SettingsPage;
