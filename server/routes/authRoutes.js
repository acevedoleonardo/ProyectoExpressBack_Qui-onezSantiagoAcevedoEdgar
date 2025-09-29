// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const { body, validationResult } = require('express-validator');

// Ruta para registrar usuario
router.post('/register',
  // Validaciones básicas
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  
  async (req, res) => {
    try {
      // Verificamos errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, nombre } = req.body;
      
      // Conectamos a la base de datos
      const db = await connectDB();
      
      // Verificamos si el usuario ya existe
      const existingUser = await db.collection('usuarios').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
      
      // Encriptamos la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Creamos el nuevo usuario
      const newUser = {
        email,
        password: hashedPassword,
        nombre,
        rol: 'usuario', // Por defecto es usuario normal
        createdAt: new Date()
      };
      
      // Guardamos en la base de datos
      const result = await db.collection('usuarios').insertOne(newUser);
      
      // Respondemos con éxito
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        userId: result.insertedId
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
  }
);

// Ruta para iniciar sesión
router.post('/login',
  // Validaciones
  body('email').isEmail(),
  body('password').notEmpty(),
  
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Conectamos a la base de datos
      const db = await connectDB();
      
      // Buscamos el usuario
      const user = await db.collection('usuarios').findOne({ email });
      
      // Verificamos si existe
      if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
      
      // Comparamos la contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
      
      // Creamos el token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Respondemos con el token
      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user._id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  }
);

module.exports = router;