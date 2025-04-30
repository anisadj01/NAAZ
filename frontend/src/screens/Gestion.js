import React, { useEffect, useState } from "react";
import "./Gestion.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function Gestion() {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ name: "", email: "", phone: "", role: "", department: "", password: "" }); // Ajout du mot de passe
    const [editEmployee, setEditEmployee] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/employees", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
        }
    };

    const addEmployee = async () => {
        try {
            setErrorMsg(""); // reset message
            const response = await fetch("http://localhost:5000/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newEmployee),
            });

            const result = await response.json();

            if (response.ok) {
                fetchEmployees();
                setNewEmployee({ name: "", email: "", phone: "", role: "", department: "", password: "" }); // Réinitialisation
                setShowForm(false);
            } else {
                setErrorMsg(result.message || "Erreur lors de l'ajout");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            setErrorMsg("Erreur inattendue");
        }
    };

    const updateEmployee = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/employees/${editEmployee.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(editEmployee),
            });
            if (response.ok) {
                fetchEmployees();
                setEditEmployee(null);
            }
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
        }
    };

    const deleteEmployee = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                fetchEmployees();
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    return (
        <div className="gestion-container">
            <h2>Gestion des employés</h2>

            <div className="action-container">
                <button onClick={() => setShowForm(!showForm)} className="btn-toggle-form">
                    {showForm ? "Fermer" : "Ajouter un employé"}
                </button>
                <input
                    type="text"
                    className="gestion-search"
                    placeholder="Rechercher un employé..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {showForm && (
                <div className="form-container">
                    <input type="text" placeholder="Nom" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
                    <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                    <input type="text" placeholder="Téléphone" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
                    <input type="text" placeholder="Rôle" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} />
                    <input type="text" placeholder="Département" value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} />
                    <input type="password" placeholder="Mot de passe" value={newEmployee.password} onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} />
                    {errorMsg && <p className="error">{errorMsg}</p>}
                    <button onClick={addEmployee} className="btn-add">Ajouter</button>
                </div>
            )}

            <table className="gestion-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Rôle</th>
                        <th>Département</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees
                        .filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))
                        .map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.phone}</td>
                                <td>{emp.role}</td>
                                <td>{emp.department}</td>
                                <td className="gestion-actions">
                                    <button onClick={() => setEditEmployee(emp)} className="gestion-btn-edit">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => deleteEmployee(emp.id)} className="gestion-btn-delete">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {editEmployee && (
                <div className="form-container">
                    <h3>Modifier l'employé</h3>
                    <input type="text" value={editEmployee.name} onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })} />
                    <input type="email" value={editEmployee.email} onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })} />
                    <input type="text" value={editEmployee.phone} onChange={(e) => setEditEmployee({ ...editEmployee, phone: e.target.value })} />
                    <input type="text" value={editEmployee.role} onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })} />
                    <input type="text" value={editEmployee.department} onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })} />
                    <input type="password" value={editEmployee.password} onChange={(e) => setEditEmployee({ ...editEmployee, password: e.target.value })} />
                    <button onClick={updateEmployee} className="btn-update">Mettre à jour</button>
                    <button onClick={() => setEditEmployee(null)} className="btn-cancel">Annuler</button>
                </div>
            )}
        </div>
    );
}

export default Gestion;