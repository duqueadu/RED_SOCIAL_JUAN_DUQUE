const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y registro de usuarios
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     description: Crea un nuevo usuario con los datos básicos y retorna su información.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - alias
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Juan
 *               last_name:
 *                 type: string
 *                 example: Pérez
 *               alias:
 *                 type: string
 *                 example: jperez
 *               email:
 *                 type: string
 *                 example: juanperez@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-15
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     alias:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Faltan campos obligatorios
 *       409:
 *         description: Alias o email ya existen
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', async (req, res) => {
  const { first_name, last_name, alias, email, password, birth_date } = req.body;
  if (!first_name || !last_name || !alias || !email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const q =
      'INSERT INTO users(first_name,last_name,alias,email,password_hash,birth_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,first_name,last_name,alias,email';
    const result = await pool.query(q, [
      first_name,
      last_name,
      alias,
      email,
      hashed,
      birth_date || null,
    ]);
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Alias or email already exists' });
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Auth]
 *     description: Autentica un usuario con email y contraseña, devolviendo un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juanperez@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     alias:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Faltan campos
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Missing' });
  try {
    const r = await pool.query(
      'SELECT id,password_hash,first_name,last_name,alias,email FROM users WHERE email=$1',
      [email]
    );
    if (!r.rowCount)
      return res.status(401).json({ error: 'Invalid credentials' });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });
    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        alias: user.alias,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

module.exports = router;