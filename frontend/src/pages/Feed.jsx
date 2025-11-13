import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [likingPost, setLikingPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [publishing, setPublishing] = useState(false);

  const store = useStore();
  const API_URL = import.meta.env.VITE_API_POST || 'http://localhost:3003';

  // Cargar posts al montar el componente
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error loading posts:', error);
      setMessage('No se pudieron cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      setLikingPost(postId);
      const token = store.token || localStorage.getItem('rs_token');

      if (!token) {
        setMessage('Debes iniciar sesión para dar like');
        return;
      }

      const response = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? { ...post, likes_count: response.data.likes }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      setMessage('Error al dar like a la publicación');
    } finally {
      setLikingPost(null);
    }
  };

  const handlePublish = async () => {
    try {
      const token = store.token || localStorage.getItem('rs_token');
      if (!token) {
        setMessage('Debes iniciar sesión para publicar');
        return;
      }

      if (!newPost.trim()) {
        setMessage('El contenido de la publicación no puede estar vacío');
        return;
      }

      setPublishing(true);
      const response = await axios.post(
        `${API_URL}/posts`,
        { message: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Añadir nueva publicación al inicio del feed
      setPosts(prev => [response.data, ...prev]);
      setNewPost('');
      setShowModal(false);
      setMessage('Publicación creada exitosamente');
    } catch (error) {
      console.error('Error al publicar:', error);
      setMessage('No se pudo crear la publicación');
    } finally {
      setPublishing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hoy a las ${date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (diffDays === 1) {
      return `Ayer a las ${date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="feed-header">
          <h1 className="feed-title">Feed de Publicaciones</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1 className="feed-title">Feed de Publicaciones</h1>
        <div className="feed-actions">
          <button
            className="btn btn--primary btn--sm"
            onClick={() => setShowModal(true)}
          >
            Nueva publicación ✍️
          </button>
          <button
            className="btn btn--outline btn--sm"
            onClick={loadPosts}
            disabled={loading}
          >
            Actualizar
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert--error' : 'alert--info'}`}>
          {message}
        </div>
      )}

      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h3 className="empty-state__title">No hay publicaciones</h3>
            <p className="empty-state__description">
              Sé el primero en compartir algo con la comunidad.
            </p>
          </div>
        ) : (
          posts.map(post => (
            <article key={post.id} className="post-card fade-in">
              <div className="post-header">
                <div className="post-user">
                  <div className="post-avatar">
                    {post.alias ? post.alias.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="post-user-info">
                    <h3 className="post-username">{post.alias}</h3>
                    <p className="post-fullname">
                      {post.first_name} {post.last_name}
                    </p>
                  </div>
                </div>
                <div className="post-meta">
                  <span className="post-time">
                    {formatDate(post.created_at)}
                  </span>
                </div>
              </div>

              <div className="post-content">
                <p className="post-message">{post.message}</p>
              </div>

              <div className="post-actions">
                <button
                  className={`post-action ${likingPost === post.id ? 'post-action--loading' : ''}`}
                  onClick={() => handleLike(post.id)}
                  disabled={likingPost === post.id}
                  aria-label="Dar like a esta publicación"
                >
                  <span className="post-action__icon">👍</span>
                  <span className="post-action__text">
                    {likingPost === post.id ? '...' : 'Like'}
                  </span>
                </button>
                <div className="post-likes">
                  <span className="post-likes-count">
                    {post.likes_count || 0}
                  </span>
                  <span className="post-likes-label">
                    me gusta{post.likes_count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal para nueva publicación */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Nueva publicación</h2>
            <textarea
              className="modal-textarea"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="¿Qué quieres compartir?"
              rows="4"
            ></textarea>

            <div className="modal-actions">
              <button
                className="btn btn--primary"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? 'Publicando...' : 'Publicar'}
              </button>
              <button
                className="btn btn--outline"
                onClick={() => setShowModal(false)}
                disabled={publishing}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
