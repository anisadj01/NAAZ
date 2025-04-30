import React, { useState, useEffect } from 'react';
import ESidebar from './components/ESidebar';
import './ED.css'; // Réutilise le CSS de ED.js pour la mise en page

const Tasks = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState('');

  // Gérer l'état d'expansion de la sidebar
  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  // Récupérer les missions assignées à l'employé connecté
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
        <h2>Mes Tâches</h2>
        {error && <p className="error">{error}</p>}
        {missions.length === 0 && !error ? (
          <p>Aucune mission assignée pour le moment.</p>
        ) : (
          <table className="missions-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Lieu</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((mission) => (
                <tr key={mission.id}>
                  <td>{mission.title}</td>
                  <td>{mission.description || 'N/A'}</td>
                  <td>{mission.start_date}</td>
                  <td>{mission.end_date}</td>
                  <td>{mission.location || 'N/A'}</td>
                  <td>{mission.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Tasks;