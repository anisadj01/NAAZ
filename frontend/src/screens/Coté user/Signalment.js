import React, { useState } from "react";
import "./Signalment.css";

const Signalment = () => {
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Vous devez être connecté !");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/signalement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Signalement envoyé ✅");
        setDescription("");
      } else {
        setMessage(data.message || "Erreur lors de l'envoi ❌");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'envoi ❌");
    }
  };

  return (
    <div className="signalment-container">
      <h2>Faire un signalement</h2>
      <form onSubmit={handleSubmit} className="signalment-form">
        <textarea
          placeholder="Décrire le problème ici..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Signalment;
