import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import { useStore } from './store';

function Navigation() {
  const user = useStore(state => state.user);
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('rs_token');
    localStorage.removeItem('rs_user');
    useStore.getState().setAuth(null, null);
    window.location.href = '/login';
  };

  return (
    <nav className="app-header">
      <div className="container">
        <div className="navbar">
          <Link to="/" className="logo">
            <span className="logo-icon">💬</span>
            Red_Social_ADUSOFT
          </Link>
          
          <ul className="nav-links">
            {user ? (
              <>
                <li>
                  <Link 
                    to="/" 
                    className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className={`nav-link ${isActiveRoute('/profile') ? 'active' : ''}`}
                  >
                    Mi Perfil
                  </Link>
                </li>
                <li className="nav-user">
                  <span className="nav-user__greeting">
                    Hola, {user.first_name || user.alias}
                  </span>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="btn btn--outline btn--sm"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/" 
                    className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className={`nav-link ${isActiveRoute('/login') ? 'active' : ''}`}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="btn btn--primary btn--sm"
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const user = useStore(state => state.user);

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={
              <div className="container">
                <div className="not-found">
                  <h1>404 - Página no encontrada</h1>
                  <p>La página que buscas no existe.</p>
                  <Link to="/" className="btn btn--primary">
                    Volver al Inicio
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <span className="logo-icon">💬</span>
                <span className="footer-logo">Red_Social_ADUSOFT</span>
              </div>
              <p className="footer-copyright">
                © 2024 Red Social ADUSOFT. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}