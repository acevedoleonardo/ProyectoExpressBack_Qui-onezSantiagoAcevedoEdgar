// ============================================
// RUTAS DE PELÍCULAS
// ============================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

// ============================================
// GET - Obtener todas las películas
// ============================================
router.get('/', async (req, res) => {
  try {
    // Conectamos a la base de datos
    const db = await connectDB();
    
    // Obtenemos todas las películas
    const peliculas = await db.collection('peliculas').find().toArray();
    
    // Enviamos la respuesta
    res.json({
      success: true,
      total: peliculas.length,
      peliculas
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas', error: error.message });
  }
});

// ============================================
// GET - Obtener película por ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    
    // Buscamos la película por ID
    const pelicula = await db.collection('peliculas').findOne({ _id: new ObjectId(id) });
    
    // Verificamos si existe
    if (!pelicula) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    
    res.json({
      success: true,
      pelicula
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener película', error: error.message });
  }
});

// ============================================
// POST - Crear nueva película
// ============================================
router.post('/',
  // Validaciones
  body('titulo').notEmpty().withMessage('El título es requerido'),
  body('descripcion').notEmpty().withMessage('La descripción es requerida'),
  body('categoria').notEmpty().withMessage('La categoría es requerida'),
  body('año').isInt({ min: 1900, max: 2030 }).withMessage('Año inválido'),
  
  async (req, res) => {
    try {
      // Verificamos errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { titulo, descripcion, categoria, año, imagen } = req.body;
      const db = await connectDB();
      
      // Verificamos si la película ya existe
      const existente = await db.collection('peliculas').findOne({ titulo });
      if (existente) {
        return res.status(400).json({ message: 'La película ya existe' });
      }
      
      // Creamos la nueva película
      const nuevaPelicula = {
        titulo,
        descripcion,
        categoria,
        año,
        imagen: imagen || null,
        aprobada: false, // Por defecto no está aprobada
        promedioCalificacion: 0,
        totalReseñas: 0,
        createdAt: new Date()
      };
      
      // Guardamos en la base de datos
      const result = await db.collection('peliculas').insertOne(nuevaPelicula);
      
      res.status(201).json({
        success: true,
        message: 'Película creada exitosamente',
        peliculaId: result.insertedId
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear película', error: error.message });
    }
  }
);

// ============================================
// PUT - Actualizar película
// ============================================
router.put('/:id',
  body('titulo').optional().notEmpty(),
  body('descripcion').optional().notEmpty(),
  body('año').optional().isInt({ min: 1900, max: 2030 }),
  
  async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const db = await connectDB();
      
      // Actualizamos la película
      const result = await db.collection('peliculas').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...req.body, updatedAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Película no encontrada' });
      }
      
      res.json({
        success: true,
        message: 'Película actualizada exitosamente'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar película', error: error.message });
    }
  }
);

// ============================================
// DELETE - Eliminar película
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    
    // Eliminamos la película
    const result = await db.collection('peliculas').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    
    res.json({
      success: true,
      message: 'Película eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar película', error: error.message });
  }
});

module.exports = router;