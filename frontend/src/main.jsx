import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Importar estilos
import './styles.css';

// Configuración inicial
const initializeApp = () => {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Root container not found');
    return;
  }

  const root = createRoot(container);

  // Renderizar la aplicación
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Manejar errores no capturados
window.addEventListener('error', (event) => {
  console.error('Error no capturado:', event.error);
});

// Manejar promesas rechazadas no capturadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesa rechazada no capturada:', event.reason);
});