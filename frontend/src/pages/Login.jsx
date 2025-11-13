import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setAuth = useStore(state => state.setAuth);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API || 'http://localhost:3001';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      
      // Guardar datos de autenticación
      setAuth(response.data.user, response.data.token);
      localStorage.setItem('rs_token', response.data.token);
      localStorage.setItem('rs_user', JSON.stringify(response.data.user));
      
      // Redirigir al feed
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || 'Error de autenticación. Por favor, intenta nuevamente.';
      
      setMessage(errorMessage);
      
      // Mostrar error específico en el campo correspondiente si existe
      if (error.response?.data?.field) {
        setErrors(prev => ({
          ...prev,
          [error.response.data.field]: errorMessage
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">👋</span>
            <h1 className="logo-text">Red_Social_ADUSOFT</h1>
          </div>
          <h2 className="login-title">Bienvenido de nuevo</h2>
          <p className="login-subtitle">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'form-control--error' : ''}`}
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && (
              <span className="form-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <Link to="/forgot-password" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-control ${errors.password ? 'form-control--error' : ''}`}
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>

          {message && !errors.email && !errors.password && (
            <div className="alert alert--error">
              {message}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn--primary btn--lg ${loading ? 'btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-text">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="signup-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}