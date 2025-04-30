import React, { useState, useEffect } from 'react';
import ESidebar from '../../components/ESidebar';
import './ED.css';

function ED() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState('');

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Utilisateur non authentifié. Veuillez vous connecter.');
          return;
        }

        const response = await fetch('http://localhost:5000/api/missions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des missions');
        }

        const data = await response.json();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMissions();
  }, []);

  return (
    <div className="ed-container">
      <ESidebar onToggle={handleSidebarToggle} />
      <div
        className="ed-content"
        style={{
          marginLeft: isSidebarExpanded ? '200px' : '60px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <div className="dashboard-header">
          <h2>Tableau de bord Employé</h2>
        </div>
        <div className="dashboard-content">
          {error && <p className="error">{error}</p>}
          {missions.length === 0 && !error ? (
            <p>Aucune mission assignée pour le moment.</p>
          ) : (
            <div className="mission-list">
              {missions.map((mission) => (
                <div key={mission.id} className="mission-card">
                  <div className="mission-info">
                    <h3>{mission.title}</h3>
                    <p><strong>Description :</strong> {mission.description || 'N/A'}</p>
                    <p><strong>Date de début :</strong> {mission.start_date}</p>
                    <p><strong>Date de fin :</strong> {mission.end_date}</p>
                    <p><strong>Lieu :</strong> {mission.location || 'N/A'}</p>
                    <p><strong>Statut :</strong> {mission.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ED;