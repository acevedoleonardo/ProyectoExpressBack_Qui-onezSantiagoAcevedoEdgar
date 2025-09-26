const express = require('express');
const jwt = require('jsonwebtoken'); // Para crear tokens JWT
const bcrypt = require('bcrypt'); // Para comparar hashes de contraseñas
const connectDB = require('../config/db'); // Para conectar a MongoDB
const { check } = require('express-validator'); // Para validar datos entrantes
const validateRequest = require('../middlewares/validateRequest'); // Middleware para validar errores

const router = express.Router();

// Ruta POST /login para autenticar usuarios
router.post('/login',
  [
    check('email').isEmail().normalizeEmail(), // Validar que email sea correcto y normalizarlo
    check('password').notEmpty() // Validar que password no esté vacío
  ],
  validateRequest, // Middleware que procesa el resultado de las validaciones
  async (req, res) => {
    try {
      const db = await connectDB(); // Conectar a la base de datos
      const { email, password } = req.body;

      // Buscar usuario en MongoDB por email
      const user = await db.collection('usuarios').findOne({ email });

      // Si el usuario no existe, error 401 (no autorizado)
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Comparar contraseña con el hash almacenado
      const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Crear token JWT con información relevante (id, email, rol)
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET, // Clave secreta en archivo .env
        { expiresIn: '1h' } // Duración del token: 1 hora
      );

      // Responder con el token JWT para que el frontend lo use
      res.json({ token });
    } catch (error) {
      // En caso de error devolver código 500 y mensaje genérico
      res.status(500).json({ message: 'Error al autenticar usuario' });
    }
  }
);

module.exports = router;
