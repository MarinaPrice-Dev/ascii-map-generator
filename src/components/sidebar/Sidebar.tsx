import React from 'react';
import './Sidebar.css';

// We'll add props for shortcuts and other functionality later
const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Placeholder for shortcut buttons - we'll implement these next */}
        <div className="sidebar-placeholder">
          <span>Shortcuts</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 