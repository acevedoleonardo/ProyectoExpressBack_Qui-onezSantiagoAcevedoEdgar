// ============================================
// RUTAS DE PELÍCULAS - ADAPTADO A BASE DE DATOS REAL
// ============================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

// ============================================
// GET - Obtener todas las películas con PAGINACIÓN
// ============================================
router.get('/', async (req, res) => {
  try {
    console.log('📋 Obteniendo películas...');
    
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // 50 películas por página
    const skip = (page - 1) * limit;
    
    // Filtros opcionales
    const filters = {};
    
    // Filtrar por tipo (movie/tv)
    if (req.query.tipo) {
      filters.categoria = req.query.tipo === 'pelicula' ? 'movie' : 'tv';
    }
    
    // Filtrar por género
    if (req.query.genero) {
      filters.genres = { $in: [req.query.genero] };
    }
    
    // Filtrar por año
    if (req.query.year) {
      filters.year = parseInt(req.query.year);
    }
    
    // Búsqueda por título
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { original_title: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const db = await connectDB();
    
    // Contar total de películas (para paginación)
    const total = await db.collection('peliculas').countDocuments(filters);
    
    // Obtener películas con paginación y ordenamiento
    const peliculas = await db.collection('peliculas')
      .find(filters)
      .sort({ popularity: -1 }) // Ordenar por popularidad
      .skip(skip)
      .limit(limit)
      .toArray();
    
    console.log(`✅ Películas encontradas: ${peliculas.length} de ${total} totales`);
    
    // Transformar datos para que coincidan con el frontend
    const peliculasTransformadas = peliculas.map(p => ({
      _id: p._id,
      titulo: p.title,
      descripcion: p.overview,
      categoria: p.genres && p.genres.length > 0 ? p.genres[0] : 'Sin categoría',
      generos: p.genres || [],
      año: p.year,
      tipo: p.categoria === 'movie' ? 'pelicula' : 'serie',
      imagen: p.poster || 'https://via.placeholder.com/300x450?text=Sin+Imagen',
      backdrop: p.backdrop,
      rating: p.vote_average || 0,
      votos: p.vote_count || 0,
      popularidad: p.popularity || 0,
      idioma: p.original_language,
      fecha_estreno: p.release_date
    }));
    
    res.json({
      success: true,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      limit: limit,
      data: peliculasTransformadas
    });
  } catch (error) {
    console.error('❌ Error al obtener películas:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener películas', 
      error: error.message 
    });
  }
});

// ============================================
// GET - Obtener película por ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando película:', id);
    
    const db = await connectDB();
    
    const pelicula = await db.collection('peliculas').findOne({ _id: new ObjectId(id) });
    
    if (!pelicula) {
      return res.status(404).json({ 
        success: false,
        message: 'Película no encontrada' 
      });
    }
    
    // Transformar datos
    const peliculaTransformada = {
      _id: pelicula._id,
      titulo: pelicula.title,
      titulo_original: pelicula.original_title,
      descripcion: pelicula.overview,
      categoria: pelicula.genres && pelicula.genres.length > 0 ? pelicula.genres[0] : 'Sin categoría',
      generos: pelicula.genres || [],
      año: pelicula.year,
      tipo: pelicula.categoria === 'movie' ? 'pelicula' : 'serie',
      imagen: pelicula.poster,
      backdrop: pelicula.backdrop,
      rating: pelicula.vote_average || 0,
      votos: pelicula.vote_count || 0,
      popularidad: pelicula.popularity || 0,
      idioma: pelicula.original_language,
      fecha_estreno: pelicula.release_date,
      tmdb_id: pelicula.tmdb_id
    };
    
    res.json({
      success: true,
      data: peliculaTransformada
    });
  } catch (error) {
    console.error('❌ Error al obtener película:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener película', 
      error: error.message 
    });
  }
});

// ============================================
// GET - Obtener géneros únicos
// ============================================
router.get('/api/genres', async (req, res) => {
  try {
    const db = await connectDB();
    
    // Obtener todos los géneros únicos
    const generos = await db.collection('peliculas').distinct('genres');
    
    res.json({
      success: true,
      data: generos.filter(g => g) // Filtrar nulos/undefined
    });
  } catch (error) {
    console.error('❌ Error al obtener géneros:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener géneros', 
      error: error.message 
    });
  }
});

// ============================================
// POST - Crear nueva película
// ============================================
router.post('/',
  body('title').notEmpty().withMessage('El título es requerido'),
  body('overview').notEmpty().withMessage('La descripción es requerida'),
  body('year').isInt({ min: 1900, max: 2030 }).withMessage('Año inválido'),
  
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { title, original_title, overview, year, genres, poster, backdrop, categoria } = req.body;
      const db = await connectDB();
      
      console.log('➕ Creando película:', title);
      
      // Crear nueva película
      const nuevaPelicula = {
        title,
        original_title: original_title || title,
        overview,
        year: parseInt(year),
        genres: genres || [],
        poster: poster || 'https://via.placeholder.com/300x450?text=Sin+Imagen',
        backdrop: backdrop || '',
        categoria: categoria || 'movie',
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
        original_language: 'es',
        createdAt: new Date()
      };
      
      const result = await db.collection('peliculas').insertOne(nuevaPelicula);
      
      console.log('✅ Película creada:', result.insertedId);
      
      res.status(201).json({
        success: true,
        message: 'Película creada exitosamente',
        data: {
          id: result.insertedId,
          ...nuevaPelicula
        }
      });
    } catch (error) {
      console.error('❌ Error al crear película:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al crear película', 
        error: error.message 
      });
    }
  }
);

// ============================================
// PUT - Actualizar película
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('✏️ Actualizando película:', id);
    
    const db = await connectDB();
    
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;
    
    const result = await db.collection('peliculas').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Película no encontrada' 
      });
    }
    
    console.log('✅ Película actualizada');
    
    res.json({
      success: true,
      message: 'Película actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al actualizar película:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar película', 
      error: error.message 
    });
  }
});

// ============================================
// DELETE - Eliminar película
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Eliminando película:', id);
    
    const db = await connectDB();
    
    const result = await db.collection('peliculas').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Película no encontrada' 
      });
    }
    
    console.log('✅ Película eliminada');
    
    res.json({
      success: true,
      message: 'Película eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar película:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar película', 
      error: error.message 
    });
  }
});

module.exports = router;