import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const store = useStore();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_USER || 'http://localhost:3002';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = store.token || localStorage.getItem('rs_token');
      
      if (!token) {
        setError('No autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/profile`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      setProfile(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading profile:', error);
      
      if (error.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // Limpiar datos de autenticación
        localStorage.removeItem('rs_token');
        localStorage.removeItem('rs_user');
        store.setAuth(null, null);
        navigate('/login');
      } else {
        setError('Error al cargar el perfil. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-container">
        <div className="alert alert--error">
          {error}
        </div>
        <button 
          className="btn btn--primary"
          onClick={() => navigate('/login')}
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <div className="empty-state__icon">👤</div>
          <h3 className="empty-state__title">Perfil no disponible</h3>
          <p className="empty-state__description">
            No se pudo cargar la información del perfil.
          </p>
        </div>
      </div>
    );
  }

  const age = calculateAge(profile.birth_date);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="container">
          <div className="profile-info">
            <div className="profile-avatar">
              {profile.alias ? profile.alias.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-details">
              <h1 className="profile-name">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.alias && (
                <p className="profile-alias">@{profile.alias}</p>
              )}
              <p className="profile-email">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="profile-content">
          <div className="profile-card">
            <h2 className="profile-card__title">Información Personal</h2>
            <div className="profile-info-grid">
              <div className="info-item">
                <span className="info-label">Alias</span>
                <span className="info-value">
                  {profile.alias || 'No especificado'}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Nombre completo</span>
                <span className="info-value">
                  {profile.first_name} {profile.last_name}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{profile.email}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Fecha de nacimiento</span>
                <span className="info-value">
                  {formatDate(profile.birth_date)}
                  {age && ` (${age} años)`}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn--outline">
              Editar Perfil
            </button>
            <button className="btn btn--secondary">
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}