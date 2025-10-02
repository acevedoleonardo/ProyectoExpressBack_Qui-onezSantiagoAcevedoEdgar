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
  
  // ==================================================
  // FUNCIÓN 2: OBTENER UNA PELÍCULA POR SU CATEGORIA
  // ==================================================
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
// EXPORTAR TODAS LAS FUNCIONES
// ==========================================
module.exports = {
    getPeliculas,
    getPeliculaById,
}
