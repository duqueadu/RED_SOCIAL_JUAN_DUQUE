/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Endpoints relacionados con el perfil del usuario
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
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Retorna los datos del usuario autenticado según el token JWT proporcionado.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 first_name:
 *                   type: string
 *                   example: "Carlos"
 *                 last_name:
 *                   type: string
 *                   example: "Pérez"
 *                 alias:
 *                   type: string
 *                   example: "carlosp"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "carlos@example.com"
 *                 birth_date:
 *                   type: string
 *                   format: date
 *                   example: "1995-04-23"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-12T14:32:00Z"
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid token"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */
router.get('/profile', authMiddleware, async (req, res) => {
  const r = await pool.query(
    'SELECT id, first_name, last_name, alias, email, birth_date, created_at FROM users WHERE id=$1',
    [req.userId]
  );
  if (!r.rowCount) return res.status(404).json({ error: 'User not found' });
  res.json(r.rows[0]);
});

module.exports = router;
