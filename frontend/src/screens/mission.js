import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaEdit, FaTrash, FaEye, FaPrint, FaPlus, FaMinus } from 'react-icons/fa';
import { debounce } from 'lodash';
import './mission.css';

// Constantes
const API_URL = 'http://localhost:5000/api/missions';
const TRANSPORT_OPTIONS = [
  { value: 'train', label: 'Train' },
  { value: 'avion', label: 'Avion' },
  { value: 'taxi', label: 'Taxi' },
  { value: 'voiture_privee', label: 'Voiture privée' },
  { value: 'ferry', label: 'Ferry' },
  { value: 'bateau', label: 'Bateau' },
];

// Composant MissionForm
function MissionForm({ mission, onSubmit, onCancel, transportOptions, isEdit = false }) {
  const [formData, setFormData] = useState({
    ...mission,
    parcours: mission.parcours && mission.parcours.length > 0
      ? mission.parcours
      : [{ departure_city: '', arrival_city: '', means_of_transport: '', observation: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('parcours')) {
      const [prefix, index, field] = name.split('.');
      setFormData((prev) => {
        const newParcours = [...prev.parcours];
        newParcours[parseInt(index)] = {
          ...newParcours[parseInt(index)],
          [field]: value,
        };
        return { ...prev, parcours: newParcours };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addTrajet = () => {
    if (formData.parcours.length < 4) {
      setFormData((prev) => ({
        ...prev,
        parcours: [
          ...prev.parcours,
          { departure_city: '', arrival_city: '', means_of_transport: '', observation: '' },
        ],
      }));
    }
  };

  const removeTrajet = (index) => {
    if (formData.parcours.length > 1) {
      setFormData((prev) => ({
        ...prev,
        parcours: prev.parcours.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.start_date || !formData.end_date || !formData.means_of_transport || !formData.emission_date) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      alert('La date de fin ne peut pas être antérieure à la date de début.');
      return;
    }
    if (!formData.parcours[0].departure_city || !formData.parcours[0].arrival_city || !formData.parcours[0].means_of_transport) {
      alert('La ville de départ, la ville d\'arrivée et le moyen de transport du premier trajet sont obligatoires.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="mission-form">
      <h3>{isEdit ? 'Modifier la mission' : 'Ajouter une mission'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="OBJET de la MISSION"
          value={formData.description || ''}
          onChange={handleChange}
        />
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Lieu"
          value={formData.location || ''}
          onChange={handleChange}
        />
        <input
          type="number"
          name="employee_id"
          placeholder="ID Employé"
          value={formData.employee_id}
          onChange={handleChange}
        />
        <select
          name="means_of_transport"
          value={formData.means_of_transport || ''}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner un moyen de transport</option>
          {transportOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {formData.parcours.map((trajet, index) => (
          <div key={index} className="trajet-section">
            <h4>Trajet {index + 1}</h4>
            <input
              type="text"
              name={`parcours.${index}.departure_city`}
              placeholder={`Ville de départ ${index + 1}`}
              value={trajet.departure_city || ''}
              onChange={handleChange}
              required={index === 0}
            />
            <input
              type="text"
              name={`parcours.${index}.arrival_city`}
              placeholder={`Ville d'arrivée ${index + 1}`}
              value={trajet.arrival_city || ''}
              onChange={handleChange}
              required={index === 0}
            />
            <select
              name={`parcours.${index}.means_of_transport`}
              value={trajet.means_of_transport || ''}
              onChange={handleChange}
              required={index === 0}
            >
              <option value="">Sélectionner un moyen de transport</option>
              {transportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              name={`parcours.${index}.observation`}
              placeholder={`Observation ${index + 1}`}
              value={trajet.observation || ''}
              onChange={handleChange}
            />
            {index > 0 && (
              <button
                type="button"
                className="mission-btn-remove-trajet"
                onClick={() => removeTrajet(index)}
                aria-label={`Supprimer le trajet ${index + 1}`}
              >
                <FaMinus /> Supprimer
              </button>
            )}
          </div>
        ))}
        {formData.parcours.length < 4 && (
          <button
            type="button"
            className="mission-btn-add-trajet"
            onClick={addTrajet}
            aria-label="Ajouter un trajet"
          >
            <FaPlus /> Ajouter un trajet
          </button>
        )}
        <input
          type="date"
          name="emission_date"
          value={formData.emission_date || ''}
          onChange={handleChange}
          required
        />
        {isEdit && (
          <select
            name="status"
            value={formData.status || 'En attente'}
            onChange={handleChange}
          >
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Terminée">Terminée</option>
          </select>
        )}
        <div className="form-buttons">
          <button type="submit" className="mission-btn-add">
            {isEdit ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button type="button" className="mission-btn-cancel" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

// Composant MissionTable
function MissionTable({ missions, onEdit, onDelete, onView, isLoading }) {
  return (
    <div className="table-wrapper">
      {isLoading ? (
        <p className="loading">Chargement des missions...</p>
      ) : missions.length > 0 ? (
        <table className="mission-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>OBJET de la MISSION</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Lieu</th>
              <th>Moyen de transport</th>
              <th>Ville de départ (1)</th>
              <th>Ville d'arrivée (1)</th>
              <th>Date d'émission</th>
              <th>Statut</th>
              <th>Employé</th>
              <th>Actions</th>
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
                <td>{mission.means_of_transport || 'N/A'}</td>
                <td>{mission.parcours?.[0]?.departure_city || 'N/A'}</td>
                <td>{mission.parcours?.[0]?.arrival_city || 'N/A'}</td>
                <td>{mission.emission_date || 'N/A'}</td>
                <td>{mission.status || 'N/A'}</td>
                <td>{mission.employee?.name || 'Inconnu'}</td>
                <td className="mission-actions">
                  <button
                    className="mission-btn-edit"
                    onClick={() => onEdit(mission)}
                    aria-label={`Modifier la mission ${mission.title}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="mission-btn-delete"
                    onClick={() => onDelete(mission.id)}
                    aria-label={`Supprimer la mission ${mission.title}`}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="mission-btn-details"
                    onClick={() => onView(mission)}
                    aria-label={`Voir les détails de la mission ${mission.title}`}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#333', textAlign: 'center' }}>
          Aucune mission trouvée.
        </p>
      )}
    </div>
  );
}

// Composant MissionDetails
function MissionDetails({ mission, onClose, printRef }) {
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(`
      <html>
        <head>
          <title>ORDRE DE MISSION</title>
          <style>
            @page {
              size: A4;
              margin: 2mm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              width: 206mm;
              height: 293mm;
              box-sizing: border-box;
            }
            .mission-details-content {
              padding: 5mm;
              border: 2px solid #000;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .ordre-mission { position: relative; }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #000;
              padding-bottom: 12px;
            }
            .logo-section {
              display: flex;
              align-items: center;
            }
            .logo-placeholder {
              width: 60px;
              height: 60px;
              margin-right: 12px;
              border: 1px dashed #000;
            }
            .company-name {
              font-size: 20px;
              font-weight: bold;
            }
            .title-section h1 {
              font-size: 26px;
              font-weight: bold;
              text-align: center;
            }
            .number-section { text-align: right; }
            .numero {
              margin-left: 6px;
              font-weight: bold;
              font-size: 16px;
            }
            .s1-box {
              border: 2px solid #000;
              padding: 6px;
              display: inline-block;
              font-weight: bold;
              font-size: 16px;
            }
            .section-1, .section-2 {
              display: flex;
              justify-content: space-between;
              margin-top: 12px;
            }
            .section-1 .field, .section-2 .field { width: 48%; }
            .field label {
              font-weight: bold;
              display: block;
              margin-bottom: 6px;
              font-size: 15px;
            }
            .field span {
              display: block;
              padding: 6px;
              border: 1px solid #000;
              min-height: 24px;
              font-size: 14px;
            }
            .full-width {
              width: 100%;
              margin-top: 12px;
            }
            .full-width span {
              font-size: 15px;
              min-height: 48px;
              line-height: 1.5;
            }
            .section-3-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
            }
            .section-3-table th, .section-3-table td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
              vertical-align: top;
              font-size: 14px;
            }
            .section-3-table th {
              font-weight: bold;
              background: #f4f4f4;
            }
            .signatures-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
              border-top: 2px solid #000;
            }
            .signatures-table th, .signatures-table td {
              border: 1px solid #000;
              padding: 6px;
              text-align: center;
              font-size: 14px;
            }
            .signatures-table th { font-weight: bold; }
            .signatures-table .signature-box {
              height: 140px;
              border: 1px solid #000;
            }
            .footer {
              margin-top: 24px;
              text-align: left;
              font-size: 13px;
            }
            .exemplaire {
              text-align: right;
              font-weight: bold;
              font-size: 13px;
            }
            @media print {
              @page {
                margin: 0;
                size: A4;
              }
              body {
                margin: 2mm;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .mission-details-content {
                border: none;
              }
              header, footer, nav, aside {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="mission-details-content">
            <div class="ordre-mission">
              ${printContent}
            </div>
          </div>
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <div className="mission-details-modal">
      <div className="mission-details-content">
        <div className="ordre-mission" ref={printRef}>
          <div className="header">
            <div className="logo-section">
              <div className="logo-placeholder"></div>
              <div className="company-name">AIR ALGÉRIE</div>
            </div>
            <div className="title-section">
              <h1>ORDRE DE MISSION</h1>
            </div>
            <div className="number-section">
              <span className="numero">N°</span>
              <span className="s1-box">S1</span>
            </div>
          </div>
          <div className="section-1">
            <div className="field">
              <label>NOM et PRÉNOMS</label>
              <span>{mission.employee?.name || 'N/A'}</span>
            </div>
            <div className="field">
              <label>EMPLOI ou FONCTION</label>
              <span>{mission.employee?.role || 'N/A'}</span>
            </div>
          </div>
          <div className="section-2">
            <div className="field">
              <label>SERVICE et LIEU D'AFFECTION</label>
              <span>{mission.location || 'N/A'}</span>
            </div>
            <div className="field">
              <label>LIEU et DATE D'ÉMISSION</label>
              <span>{mission.location || 'N/A'}, {mission.emission_date || new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="section-2">
            <div className="field">
              <label>DATE DE DÉPART</label>
              <span>{mission.start_date}</span>
            </div>
            <div className="field">
              <label>DURÉE PRÉVUE</label>
              <span>
                {Math.ceil(
                  (new Date(mission.end_date) - new Date(mission.start_date)) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                jours
              </span>
            </div>
          </div>
          <div className="field full-width">
            <label>OBJET de la MISSION</label>
            <span>{mission.description || 'N/A'}</span>
          </div>
          <table className="section-3-table">
            <thead>
              <tr>
                <th>PARCOURS</th>
                <th>MOYENS</th>
                <th>OBSERVATIONS</th>
              </tr>
            </thead>
            <tbody>
              {mission.parcours?.map((trajet, index) => (
                <tr key={index}>
                  <td>{`${trajet.departure_city || 'N/A'} - ${trajet.arrival_city || 'N/A'}`}</td>
                  <td>{trajet.means_of_transport || mission.means_of_transport || 'N/A'}</td>
                  <td>{trajet.observation || 'N/A'}</td>
                </tr>
              ))}
              {Array(4 - (mission.parcours?.length || 0)).fill().map((_, index) => (
                <tr key={`empty-${index}`}>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="signatures-table">
            <thead>
              <tr>
                <th>L'AGENT</th>
                <th>LE DIRECTEUR</th>
                <th>LA DIRECTION GÉNÉRALE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="signature-box"></td>
                <td className="signature-box"></td>
                <td className="signature-box"></td>
              </tr>
            </tbody>
          </table>
          <div className="footer">
            <p>
              (1) Établir en 5 exemplaires.<br />
              (2) Indiquer les parcours non utilisés.<br />
              (3) Avion (AH, AF, etc...) - Fer - Route.
            </p>
            <p className="exemplaire">1er EXEMPLAIRE DESTINÉ A L'INTÉRESSÉ</p>
          </div>
        </div>
        <div className="form-buttons">
          <button
            className="mission-btn-cancel"
            onClick={onClose}
            aria-label="Fermer les détails"
          >
            Fermer
          </button>
          <button
            className="mission-btn-print"
            onClick={handlePrint}
            aria-label="Imprimer l'ordre de mission"
          >
            <FaPrint /> Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant Principal
function Mission() {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    employee_id: '',
    means_of_transport: '',
    parcours: [
      { departure_city: '', arrival_city: '', means_of_transport: '', observation: '' },
    ],
    emission_date: '',
  });
  const [editMission, setEditMission] = useState(null);
  const [detailMission, setDetailMission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const printRef = useRef();

  useEffect(() => {
    fetchMissions();
  }, []);

  /** Fetch missions from API */
  const fetchMissions = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Réinitialiser l'erreur
    if (!token) {
      setError('Aucun token d’authentification trouvé. Veuillez vous connecter.');
      setIsLoading(false);
      console.error('Erreur: Token manquant dans localStorage');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erreur HTTP: ${response.status}`;
        if (response.status === 401) {
          throw new Error('Token invalide ou expiré. Veuillez vous reconnecter.');
        } else if (response.status === 403) {
          throw new Error('Accès interdit. Vérifiez vos autorisations.');
        } else if (response.status >= 500) {
          throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.warn('Les données reçues ne sont pas un tableau:', data);
        throw new Error('Format de données inattendu. Attendu: tableau de missions.');
      }

      setMissions(data);
      setFilteredMissions(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des missions:', {
        message: error.message,
        stack: error.stack,
        url: API_URL,
        token: token ? 'Présent' : 'Absent',
      });
      setError(error.message || 'Une erreur inconnue est survenue.');
      setMissions([]);
      setFilteredMissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /** Add a new mission */
  const addMission = async (missionData) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...missionData,
          parcours: missionData.parcours,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de l’ajout');
      }
      await fetchMissions();
      setNewMission({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        employee_id: '',
        means_of_transport: '',
        parcours: [
          { departure_city: '', arrival_city: '', means_of_transport: '', observation: '' },
        ],
        emission_date: '',
      });
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Update an existing mission */
  const updateMission = async (missionData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${missionData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...missionData,
          parcours: missionData.parcours,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }
      await fetchMissions();
      setEditMission(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Delete a mission */
  const deleteMission = async (missionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${missionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la suppression');
      }
      await fetchMissions();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Handle search with debounce */
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      const filtered = missions.filter((mission) =>
        mission.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMissions(filtered);
    }, 300),
    [missions]
  );

  return (
    <div className="mission-container">
      <h2>Gestion des Missions</h2>
      {error && <p className="error-message">{error}</p>}
      {isLoading && <p className="loading">Chargement...</p>}

      <div className="action-container">
        <input
          type="text"
          placeholder="Rechercher une mission..."
          onChange={(e) => handleSearch(e.target.value)}
          className="mission-search"
          aria-label="Rechercher une mission"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="mission-btn-toggle"
          aria-label={showForm ? 'Fermer le formulaire' : 'Ajouter une mission'}
          aria-expanded={showForm}
        >
          {showForm ? 'Fermer' : 'Ajouter une mission'}
        </button>
      </div>

      {showForm && (
        <MissionForm
          mission={newMission}
          onSubmit={addMission}
          onCancel={() => setShowForm(false)}
          transportOptions={TRANSPORT_OPTIONS}
        />
      )}

      <MissionTable
        missions={filteredMissions}
        onEdit={setEditMission}
        onDelete={deleteMission}
        onView={setDetailMission}
        isLoading={isLoading}
      />

      {editMission && (
        <MissionForm
          mission={editMission}
          onSubmit={updateMission}
          onCancel={() => setEditMission(null)}
          transportOptions={TRANSPORT_OPTIONS}
          isEdit
        />
      )}

      {detailMission && (
        <MissionDetails
          mission={detailMission}
          onClose={() => setDetailMission(null)}
          printRef={printRef}
        />
      )}
    </div>
  );
}

export default Mission;