import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Register() {
  const [formData, setFormData] = useState({
    alias: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setAuth = useStore(state => state.setAuth);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API || 'http://localhost:3000';

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

    // Validación de alias
    if (!formData.alias) {
      newErrors.alias = 'El alias es requerido';
    } else if (formData.alias.length < 3) {
      newErrors.alias = 'El alias debe tener al menos 3 caracteres';
    }

    // Validación de nombre
    if (!formData.first_name) {
      newErrors.first_name = 'El nombre es requerido';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validación de apellido
    if (!formData.last_name) {
      newErrors.last_name = 'El apellido es requerido';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validación de fecha de nacimiento
    if (!formData.birth_date) {
      newErrors.birth_date = 'La fecha de nacimiento es requerida';
    } else {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.birth_date = 'Debes tener al menos 13 años para registrarte';
      } else if (age > 120) {
        newErrors.birth_date = 'Por favor ingresa una fecha de nacimiento válida';
      }
    }

    // Validación de email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Validación de confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      // Preparar datos para enviar (sin confirmPassword)
      const { confirmPassword, ...registerData } = formData;

      const response = await axios.post(`${API_URL}/register`, registerData);
      
      // Si el registro es exitoso y la API devuelve token, autenticar automáticamente
      if (response.data.token) {
        setAuth(response.data.user, response.data.token);
        localStorage.setItem('rs_token', response.data.token);
        localStorage.setItem('rs_user', JSON.stringify(response.data.user));
        
        // Redirigir al feed
        navigate('/', { replace: true });
      } else {
        // Si no hay token, redirigir al login
        setMessage('¡Registro exitoso! Por favor inicia sesión.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Register error:', error);
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || 'Error en el registro. Por favor, intenta nuevamente.';
      
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

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <span className="logo-icon">👤</span>
            <h1 className="logo-text">Red_Social_ADUSOFT</h1>
          </div>
          <h2 className="register-title">Crear Cuenta</h2>
          <p className="register-subtitle">
            Únete a nuestra comunidad y comienza a compartir
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="alias" className="form-label">
                Alias *
              </label>
              <input
                id="alias"
                name="alias"
                type="text"
                className={`form-control ${errors.alias ? 'form-control--error' : ''}`}
                placeholder="Tu alias único"
                value={formData.alias}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.alias && (
                <span className="form-error">{errors.alias}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="birth_date" className="form-label">
                Fecha de Nacimiento *
              </label>
              <input
                id="birth_date"
                name="birth_date"
                type="date"
                className={`form-control ${errors.birth_date ? 'form-control--error' : ''}`}
                value={formData.birth_date}
                onChange={handleChange}
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birth_date && (
                <span className="form-error">{errors.birth_date}</span>
              )}
              {formData.birth_date && !errors.birth_date && (
                <span className="form-help">
                  Edad: {calculateAge(formData.birth_date)} años
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">
                Nombre *
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                className={`form-control ${errors.first_name ? 'form-control--error' : ''}`}
                placeholder="Tu nombre"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.first_name && (
                <span className="form-error">{errors.first_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name" className="form-label">
                Apellido *
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                className={`form-control ${errors.last_name ? 'form-control--error' : ''}`}
                placeholder="Tu apellido"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.last_name && (
                <span className="form-error">{errors.last_name}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico *
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-control ${errors.password ? 'form-control--error' : ''}`}
                placeholder="Crea una contraseña segura"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
              <div className="password-requirements">
                <span className="requirement-title">La contraseña debe contener:</span>
                <ul className="requirement-list">
                  <li className={formData.password.length >= 6 ? 'requirement-met' : ''}>
                    Al menos 6 caracteres
                  </li>
                  <li className={/(?=.*[a-z])/.test(formData.password) ? 'requirement-met' : ''}>
                    Una letra minúscula
                  </li>
                  <li className={/(?=.*[A-Z])/.test(formData.password) ? 'requirement-met' : ''}>
                    Una letra mayúscula
                  </li>
                  <li className={/(?=.*\d)/.test(formData.password) ? 'requirement-met' : ''}>
                    Un número
                  </li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-control ${errors.confirmPassword ? 'form-control--error' : ''}`}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span className="form-help success">Las contraseñas coinciden</span>
              )}
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('éxito') ? 'alert--success' : 'alert--error'}`}>
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
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p className="login-text">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}