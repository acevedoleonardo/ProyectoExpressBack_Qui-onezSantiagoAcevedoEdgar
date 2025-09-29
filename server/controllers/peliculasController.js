// ==========================================
// ARCHIVO: server/controllers/peliculasController.js
// PROPÓSITO: Lógica de negocio para manejar películas
// ==========================================

const connectDB = require('../config/db'); // Función para conectar a la base de datos
const { ObjectId } = require('mongodb'); // Para trabajar con IDs de MongoDB

// ==========================================
// FUNCIÓN 1: OBTENER TODAS LAS PELÍCULAS
// ==========================================
async function getPeliculas(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB();
    
    // PASO 2: Buscar todas las películas en la colección 'peliculas'
    const peliculas = await db.collection('peliculas').find({}).toArray();
    
    // PASO 3: Mostrar información en consola (para debug)
    console.log(`📽️ Encontradas ${peliculas.length} películas en el catálogo`);
    
    // PASO 4: Enviar respuesta exitosa al cliente
    res.status(200).json({
      success: true, // Indica que todo salió bien
      message: 'Películas obtenidas correctamente',
      cantidad: peliculas.length,
      data: peliculas // Los datos reales
    });
    
  } catch (error) {
    // Si hay error, pasarlo al middleware de manejo de errores
    console.error('❌ Error al obtener películas:', error.message);
    next(error);
  }
}

// ==========================================
// FUNCIÓN 2: OBTENER UNA PELÍCULA POR SU ID
// ==========================================
async function getPeliculaById(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB();
    
    // PASO 2: Obtener el ID desde los parámetros de la URL (/peliculas/123abc)
    const { id } = req.params;
    
    // PASO 3: Validar que el ID tenga formato correcto de MongoDB
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de película no válido'
      });
    }
    
    // PASO 4: Buscar la película específica en la base de datos
    const pelicula = await db.collection('peliculas').findOne({ 
      _id: new ObjectId(id) 
    });
    
    // PASO 5: Verificar si se encontró la película
    if (!pelicula) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    // PASO 6: Enviar la película encontrada
    console.log(`🎬 Película encontrada: ${pelicula.title}`);
    res.status(200).json({
      success: true,
      message: 'Película encontrada',
      data: pelicula
    });
    
  } catch (error) {
    console.error('❌ Error al obtener película por ID:', error.message);
    next(error);
  }
}

// ==========================================
// FUNCIÓN 3: CREAR UNA NUEVA PELÍCULA
// ==========================================
async function createPelicula(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB();
    
    // PASO 2: Obtener los datos de la nueva película desde el cuerpo de la petición
    const nuevaPelicula = req.body;
    
    // PASO 3: Agregar fecha de creación automáticamente
    nuevaPelicula.fechaCreacion = new Date();
    nuevaPelicula.fechaActualizacion = new Date();
    
    // PASO 4: Verificar si ya existe una película con el mismo tmdb_id
    if (nuevaPelicula.tmdb_id) {
      const peliculaExistente = await db.collection('peliculas').findOne({
        tmdb_id: nuevaPelicula.tmdb_id
      });
      
      if (peliculaExistente) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe una película con ese TMDB ID'
        });
      }
    }
    
    // PASO 5: Insertar la nueva película en la base de datos
    const resultado = await db.collection('peliculas').insertOne(nuevaPelicula);
    
    // PASO 6: Confirmar que se creó correctamente
    console.log(`✅ Nueva película creada: ${nuevaPelicula.title}`);
    res.status(201).json({
      success: true,
      message: 'Película creada exitosamente',
      id: resultado.insertedId // ID de la película recién creada
    });
    
  } catch (error) {
    console.error('❌ Error al crear película:', error.message);
    next(error);
  }
}

// ==========================================
// FUNCIÓN 4: ACTUALIZAR UNA PELÍCULA EXISTENTE
// ==========================================
async function updatePelicula(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB();
    
    // PASO 2: Obtener ID y datos a actualizar
    const { id } = req.params;
    const cambios = req.body;
    
    // PASO 3: Validar ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de película no válido'
      });
    }
    
    // PASO 4: Agregar fecha de actualización
    cambios.fechaActualizacion = new Date();
    
    // PASO 5: Actualizar la película en la base de datos
    const resultado = await db.collection('peliculas').updateOne(
      { _id: new ObjectId(id) }, // Filtro: qué documento actualizar
      { $set: cambios } // Operación: qué campos cambiar
    );
    
    // PASO 6: Verificar si se encontró y actualizó la película
    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    // PASO 7: Confirmar actualización
    console.log(`📝 Película actualizada con ID: ${id}`);
    res.status(200).json({
      success: true,
      message: 'Película actualizada correctamente'
    });
    
  } catch (error) {
    console.error('❌ Error al actualizar película:', error.message);
    next(error);
  }
}

// ==========================================
// FUNCIÓN 5: ELIMINAR UNA PELÍCULA
// ==========================================
async function deletePelicula(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB();
    
    // PASO 2: Obtener el ID de la película a eliminar
    const { id } = req.params;
    
    // PASO 3: Validar ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de película no válido'
      });
    }
    
    // PASO 4: Eliminar la película de la base de datos
    const resultado = await db.collection('peliculas').deleteOne({
      _id: new ObjectId(id)
    });
    
    // PASO 5: Verificar si se eliminó algo
    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    // PASO 6: Confirmar eliminación
    console.log(`🗑️ Película eliminada con ID: ${id}`);
    res.status(200).json({
      success: true,
      message: 'Película eliminada correctamente'
    });
    
  } catch (error) {
    console.error('❌ Error al eliminar película:', error.message);
    next(error);
  }
}

// ==========================================
// EXPORTAR TODAS LAS FUNCIONES
// ==========================================
module.exports = {
  getPeliculas,
  getPeliculaById,
  createPelicula,
  updatePelicula,
  deletePelicula
};

// ==========================================
// NOTAS:
// - Cada función maneja una operación CRUD (Create, Read, Update, Delete)
// - Siempre validamos los datos antes de usarlos
// - Los errores se pasan al middleware con next(error)
// - Usamos try-catch para capturar errores
// - Los status codes HTTP indican el resultado (200=ok, 404=no encontrado, etc)
// ==========================================
