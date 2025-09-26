const connectDB = require('../config/db'); // Importa función para conectar a la base de datos
const { ObjectId } = require('mongodb'); // Importa ObjectId para manejar IDs de MongoDB

// Obtener todas las películas de la colección
async function getPeliculas(req, res, next) {
  try {
    const db = await connectDB(); // Obtener conexión a la BD
    const peliculas = await db.collection('peliculas').find({}).toArray(); // Buscar todas las películas
    res.json(peliculas); // Responder con el array de películas en formato JSON
  } catch (err) {
    next(err); // Pasar cualquier error al middleware centralizado de manejo de errores
  }
}

// Obtener una película por su ID MongoDB
async function getPeliculaById(req, res, next) {
  try {
    const db = await connectDB();
    const { id } = req.params; // ID recibido como parámetro de la ruta
    const pelicula = await db.collection('peliculas').findOne({ _id: new ObjectId(id) }); // Buscar película por _id

    if (!pelicula) {
      // Si no existe la película, responder error 404
      return res.status(404).json({ message: 'No encontrado' });
    }

    res.json(pelicula); // Responder con la película encontrada
  } catch (err) {
    next(err);
  }
}

// Crear una nueva película
async function createPelicula(req, res, next) {
  try {
    const db = await connectDB();
    const nuevaPelicula = req.body; // Obtener los datos enviados en el cuerpo de la solicitud
    await db.collection('peliculas').insertOne(nuevaPelicula); // Insertar documento nuevo
    res.status(201).json({ message: 'Película creada' }); // Responder con status 201 y mensaje de confirmación
  } catch (err) {
    next(err);
  }
}

// Actualizar película existente por ID
async function updatePelicula(req, res, next) {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const cambios = req.body; // Datos con cambios

    // Realizar update seteando los campos enviados (parcial)
    const result = await db.collection('peliculas').updateOne(
      { _id: new ObjectId(id) },
      { $set: cambios }
    );

    if (result.matchedCount === 0) {
      // No se encontró película con ese ID, error 404
      return res.status(404).json({ message: 'No encontrado' });
    }

    res.json({ message: 'Película actualizada' });
  } catch (err) {
    next(err);
  }
}

// Eliminar película por ID
async function deletePelicula(req, res, next) {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const result = await db.collection('peliculas').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No encontrado' });
    }

    res.json({ message: 'Película eliminada' });
  } catch (err) {
    next(err);
  }
}

// Exporta todas las funciones para usarlas en rutas
module.exports = {
  getPeliculas,
  getPeliculaById,
  createPelicula,
  updatePelicula,
  deletePelicula
};
