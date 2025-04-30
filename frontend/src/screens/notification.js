import React, { useEffect, useState } from "react";
import axios from "axios";
import "./notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la notification :", error);
    }
  };

  return (
    <div className="notifications-container">
      <h2> Notifications</h2>
      {notifications.length === 0 ? (
        <p>Aucune notification</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notif) => (
            <li 
              key={notif.id} 
              className={`notification-item ${notif.is_read ? "" : "unread"}`}
            >
              <span className="notification-message">{notif.message}</span>
              <span className="notification-time">
                {new Date(notif.createdAt).toLocaleTimeString()}
              </span>
              {!notif.is_read && (
                <button className="read-btn" onClick={() => markAsRead(notif.id)}>
                  Marquer comme lue
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
