import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaTasks, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';
import smallLogo from './small-logo.png';
import largeLogo from './big-logo.png';
import './ESidebar.css';

function ESidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    setIsExpanded(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-header">
        <img
          src={isExpanded ? largeLogo : smallLogo}
          className="sidebar-logo"
          alt="Logo"
        />
        <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
          <FaBars />
        </button>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/Tasks">
            <FaTasks className="icon" />
            {isExpanded && <span>Ordre De Mission</span>}
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/signalment">
            <FaExclamationTriangle className="icon" />
            {isExpanded && <span>Signalement</span>}
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/justification">
            <FaFileAlt className="icon" />
            {isExpanded && <span>Justification</span>}
          </Link>
        </li>
        <li className="sidebar-item logout">
          <button onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            {isExpanded && <span>Déconnexion</span>}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ESidebar;