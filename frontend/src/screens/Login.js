import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
 // Assurez-vous d'avoir un logo dans le dossier assets

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/dash"); // Redirection après connexion
      } else {
        setError(data.message || "Échec de la connexion");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
       
        <h2>Connexion</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;