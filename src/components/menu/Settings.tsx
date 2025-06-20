import React from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="settings-container">
      <div className="settings-section">
        <h3>Grid Settings</h3>
        <div className="setting-item">
          <label>Default Cell Size:</label>
          <select defaultValue="20">
            <option value="16">16px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="28">28px</option>
            <option value="32">32px</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Grid Theme:</label>
          <select defaultValue="dark">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="terminal">Terminal</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Drawing Settings</h3>
        <div className="setting-item">
          <label>Default Character:</label>
          <input type="text" defaultValue="#" maxLength={1} />
        </div>
        <div className="setting-item">
          <label>Default Foreground:</label>
          <input type="color" defaultValue="#FFFFFF" />
        </div>
        <div className="setting-item">
          <label>Default Background:</label>
          <input type="color" defaultValue="#222222" />
        </div>
      </div>

      <div className="settings-section">
        <h3>Interface Settings</h3>
        <div className="setting-item">
          <label>Auto-save:</label>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <label>Show Grid Lines:</label>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <label>Show Coordinates:</label>
          <input type="checkbox" />
        </div>
      </div>

      <div className="settings-section">
        <h3>Export Settings</h3>
        <div className="setting-item">
          <label>Default Export Format:</label>
          <select defaultValue="txt">
            <option value="txt">Text (.txt)</option>
            <option value="json">JSON (.json)</option>
            <option value="ansi">ANSI (.ans)</option>
            <option value="rot">ROT (.rot)</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Include Metadata:</label>
          <input type="checkbox" defaultChecked />
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-settings">Save Settings</button>
        <button className="reset-settings">Reset to Defaults</button>
      </div>
    </div>
  );
};

export default Settings; 