// ==========================================
// ARCHIVO: server/controllers/peliculasController.js
// PROPÓSITO: Lógica de negocio para manejar películas
// ==========================================

// Importa la función para conectar a la base de datos
const connectDB = require('../config/db');
// Importa ObjectId para trabajar con IDs de MongoDB
const { ObjectId } = require('mongodb');

// ==========================================
// FUNCIÓN 1: OBTENER TODAS LAS PELÍCULAS
// ==========================================
// Función para obtener todas las películas
async function getPeliculas(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB(); // Conecta a la base de datos
    
    // PASO 2: Buscar todas las películas en la colección 'peliculas'
    const peliculas = await db.collection('peliculas').find({}).toArray(); // Obtiene todas las películas como un arreglo
    
    // PASO 3: Mostrar información en consola (para debug)
    console.log(`📽️ Encontradas ${peliculas.length} películas en el catálogo`); // Muestra cuántas películas se encontraron
    
    // PASO 4: Enviar respuesta exitosa al cliente
    res.status(200).json({ // Envía respuesta HTTP 200 con los datos
      success: true, // Indica que todo salió bien
      message: 'Películas obtenidas correctamente', // Mensaje descriptivo
      cantidad: peliculas.length, // Número de películas encontradas
      data: peliculas // Los datos reales de las películas
    });
    
  } catch (error) {
    // Si hay error, pasarlo al middleware de manejo de errores
    console.error('❌ Error al obtener películas:', error.message); // Muestra el error en consola
    next(error); // Pasa el error al siguiente middleware
  }
}

// ==========================================
// FUNCIÓN 2: OBTENER UNA PELÍCULA POR SU ID
// ==========================================
// Función para obtener una película por su ID
async function getPeliculaById(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB(); // Conecta a la base de datos
    
    // PASO 2: Obtener el ID desde los parámetros de la URL (/peliculas/:id)
    const { id } = req.params; // Extrae el id de la URL
    
    // PASO 3: Validar que el ID tenga formato correcto de MongoDB
    if (!ObjectId.isValid(id)) { // Verifica si el id es válido
      return res.status(400).json({ // Si no es válido, responde con error 400
        success: false,
        message: 'ID de película no válido'
      });
    }
    
    // PASO 4: Buscar la película específica en la base de datos
    const pelicula = await db.collection('peliculas').findOne({ 
      _id: new ObjectId(id) // Busca por el _id convertido a ObjectId
    });
    
    // PASO 5: Verificar si se encontró la película
    if (!pelicula) { // Si no se encuentra, responde con error 404
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    // PASO 6: Enviar la película encontrada
    console.log(`🎬 Película encontrada: ${pelicula.title}`); // Muestra el título en consola
    res.status(200).json({ // Envía la película encontrada
      success: true,
      message: 'Película encontrada',
      data: pelicula
    });
    
  } catch (error) {
    console.error('❌ Error al obtener película por ID:', error.message); // Muestra el error en consola
    next(error); // Pasa el error al siguiente middleware
  }
}

// ==========================================
// FUNCIÓN 3: CREAR UNA NUEVA PELÍCULA
// ==========================================
// Función para crear una nueva película
async function createPelicula(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB(); // Conecta a la base de datos
    
    // PASO 2: Obtener los datos de la nueva película desde el cuerpo de la petición
    const nuevaPelicula = req.body; // Obtiene los datos enviados por el cliente
    
    // PASO 3: Agregar fecha de creación automáticamente
    nuevaPelicula.fechaCreacion = new Date(); // Fecha de creación actual
    nuevaPelicula.fechaActualizacion = new Date(); // Fecha de actualización actual
    
    // PASO 4: Verificar si ya existe una película con el mismo tmdb_id
    if (nuevaPelicula.tmdb_id) { // Si se envió tmdb_id
      const peliculaExistente = await db.collection('peliculas').findOne({
        tmdb_id: nuevaPelicula.tmdb_id // Busca si ya existe ese tmdb_id
      });
      
      if (peliculaExistente) { // Si existe, responde con error 409
        return res.status(409).json({
          success: false,
          message: 'Ya existe una película con ese TMDB ID'
        });
      }
    }
    
    // PASO 5: Insertar la nueva película en la base de datos
    const resultado = await db.collection('peliculas').insertOne(nuevaPelicula); // Inserta la película
    
    // PASO 6: Confirmar que se creó correctamente
    console.log(`✅ Nueva película creada: ${nuevaPelicula.title}`); // Muestra el título en consola
    res.status(201).json({ // Envía respuesta HTTP 201 con el id creado
      success: true,
      message: 'Película creada exitosamente',
      id: resultado.insertedId // ID de la película recién creada
    });
    
  } catch (error) {
    console.error('❌ Error al crear película:', error.message); // Muestra el error en consola
    next(error); // Pasa el error al siguiente middleware
  }
}

// ==========================================
// FUNCIÓN 4: ACTUALIZAR UNA PELÍCULA EXISTENTE
// ==========================================
// Función para actualizar una película existente
async function updatePelicula(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB(); // Conecta a la base de datos
    
    // PASO 2: Obtener ID y datos a actualizar
    const { id } = req.params; // Extrae el id de la URL
    const cambios = req.body; // Obtiene los cambios enviados por el cliente
    
    // PASO 3: Validar ID
    if (!ObjectId.isValid(id)) { // Verifica si el id es válido
      return res.status(400).json({ // Si no es válido, responde con error 400
        success: false,
        message: 'ID de película no válido'
      });
    }
    
    // PASO 4: Agregar fecha de actualización
    cambios.fechaActualizacion = new Date(); // Actualiza la fecha de modificación
    
    // PASO 5: Actualizar la película en la base de datos
    const resultado = await db.collection('peliculas').updateOne(
      { _id: new ObjectId(id) }, // Filtro: qué documento actualizar
      { $set: cambios } // Operación: qué campos cambiar
    );
    
    // PASO 6: Verificar si se encontró y actualizó la película
    if (resultado.matchedCount === 0) { // Si no se encontró, responde con error 404
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    // PASO 7: Confirmar actualización
    console.log(`📝 Película actualizada con ID: ${id}`); // Muestra el id actualizado en consola
    res.status(200).json({ // Envía respuesta HTTP 200
      success: true,
      message: 'Película actualizada correctamente'
    });
    
  } catch (error) {
    console.error('❌ Error al actualizar película:', error.message); // Muestra el error en consola
    next(error); // Pasa el error al siguiente middleware
  }
}

// ==========================================
// FUNCIÓN 5: ELIMINAR UNA PELÍCULA
// ==========================================
// Función para eliminar una película
async function deletePelicula(req, res, next) {
  try {
    // PASO 1: Obtener conexión a la base de datos
    const db = await connectDB(); // Conecta a la base de datos
    
    // PASO 2: Obtener el ID de la película a eliminar
    const { id } = req.params; // Extrae el id de la URL
    
    // PASO 3: Validar ID
    if (!ObjectId.isValid(id)) { // Verifica si el id es válido
      return res.status(400).json({ // Si no es válido, responde con error 400
        success: false,
        message: 'ID de película no válido'
      });
    }
    
    // PASO 4: Eliminar la película de la base de datos
    const resultado = await db.collection('peliculas').deleteOne({
      _id: new ObjectId(id) // Elimina por el _id convertido a ObjectId
    });
    
    // PASO 5: Verificar si se eliminó algo
    if (resultado.deletedCount === 0) { // Si no se eliminó nada, responde con error 404
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }
    
    // PASO 6: Confirmar eliminación
    console.log(`🗑️ Película eliminada con ID: ${id}`); // Muestra el id eliminado en consola
    res.status(200).json({ // Envía respuesta HTTP 200
      success: true,
      message: 'Película eliminada correctamente'
    });
    
  } catch (error) {
    console.error('❌ Error al eliminar película:', error.message); // Muestra el error en consola
    next(error); // Pasa el error al siguiente middleware
  }
}

// ==========================================
// EXPORTAR TODAS LAS FUNCIONES
// ==========================================
// Exporta todas las funciones para usarlas en las rutas
module.exports = {
  getPeliculas, // Obtener todas las películas
  getPeliculaById, // Obtener una película por ID
  createPelicula, // Crear una nueva película
  updatePelicula, // Actualizar una película existente
  deletePelicula // Eliminar una película
};

// ==========================================
// NOTAS:
// - Cada función maneja una operación CRUD (Create, Read, Update, Delete)
// - Siempre validamos los datos antes de usarlos
// - Los errores se pasan al middleware con next(error)
// - Usamos try-catch para capturar errores
// - Los status codes HTTP indican el resultado (200=ok, 404=no encontrado, etc)
// ==========================================
