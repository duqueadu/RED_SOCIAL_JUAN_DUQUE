/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints para gestionar publicaciones y likes
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Middleware de autenticación
 */
function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Missing token' });
  const parts = h.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });
  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Listar publicaciones
 *     tags: [Posts]
 *     description: Retorna todas las publicaciones con información del usuario y número de likes.
 *     responses:
 *       200:
 *         description: Lista de publicaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   alias:
 *                     type: string
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   message:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   likes_count:
 *                     type: integer
 */
router.get('/posts', async (req, res) => {
  const q = `
    SELECT p.id, p.user_id, p.message, p.created_at, u.alias, u.first_name, u.last_name,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes_count
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `;
  const r = await pool.query(q);
  res.json(r.rows);
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear una publicación
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hola mundo"
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Mensaje requerido
 *       401:
 *         description: Token inválido o ausente
 */
router.post('/posts', authMiddleware, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  const r = await pool.query(
    'INSERT INTO posts(user_id,message) VALUES($1,$2) RETURNING id,message,created_at',
    [req.userId, message]
  );
  res.status(201).json(r.rows[0]);
});

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Dar "like" a una publicación
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Número de likes actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *       401:
 *         description: Token inválido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/posts/:id/like', authMiddleware, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  try {
    await pool.query(
      'INSERT INTO likes(post_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING',
      [postId, req.userId]
    );
    const cnt = await pool.query('SELECT COUNT(*) FROM likes WHERE post_id=$1', [postId]);
    res.json({ likes: parseInt(cnt.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

module.exports = router;
