import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../src/components/Sidebar';
import Dashboard from '../src/screens/Dashboard';
import Login from '../src/screens/Login';
import Gestion from '../src/screens/Gestion';
import Mission from '../src/screens/mission';
import Notification from '../src/screens/notification';
import ED from './screens/Coté user/ED';
import Signalment from '../src/screens/Coté user/Signalment';

const Layout = ({ children, isAuthenticated, user }) => {
  const location = useLocation();
  const showSidebar = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/Edashboard';

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
      {showSidebar && <Sidebar />}
      <div className="content" style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} user={user}>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/gestion" element={isAuthenticated ? <Gestion /> : <Navigate to="/login" />} />
          <Route path="/mission" element={isAuthenticated ? <Mission /> : <Navigate to="/login" />} />
          <Route path="/notification" element={isAuthenticated ? <Notification /> : <Navigate to="/login" />} />
          <Route path="/Edashboard" element={isAuthenticated ? <ED /> : <Navigate to="/login" />} />
          <Route path="/signalments" element={isAuthenticated ? <Signalment user={user} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;