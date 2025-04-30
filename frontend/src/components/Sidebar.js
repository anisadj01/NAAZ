import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaChartLine, FaUserTie, FaBriefcase, FaBell } from "react-icons/fa"; // ✅ Ajout de l'icône mission
import "./Sidebar.css";
import smallLogo from "./small-logo.png";
import largeLogo from "./big-logo.png";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    // Réinitialise l'état de la sidebar
    setIsExpanded(false);
    
    // Supprime les informations d'authentification (par exemple, le token JWT)
    localStorage.removeItem("authToken"); // Si tu stockes le token dans localStorage
    
    // Redirige l'utilisateur vers la page de connexion
    window.location.href = "/login"; // Ou utilise React Router pour rediriger
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
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
          <Link to="/dashboard">
            <FaChartLine className="icon" />
            {isExpanded && <span>Dashboard</span>}
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/gestion">
            <FaUserTie className="icon" />
            {isExpanded && <span>Employés</span>}
          </Link>
        </li>
        {/* ✅ Nouveau bouton Missions */}
        <li className="sidebar-item">
          <Link to="/mission">
            <FaBriefcase className="icon" />
            {isExpanded && <span>Missions</span>}
          </Link>
        </li>

        <li className="sidebar-item">
          <Link to="/notification">
            <FaBell className="icon" />
            {isExpanded && <span>Notifications</span>}
          </Link>
        </li>
        <li className="sidebar-item logout">
          <button onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            {isExpanded && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;