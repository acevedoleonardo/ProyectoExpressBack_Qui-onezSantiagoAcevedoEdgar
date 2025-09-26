const { MongoClient } = require('mongodb'); // Importa el cliente oficial de MongoDB para Node.js
require('dotenv').config(); // Carga las variables de entorno definidas en el archivo .env

const uri = process.env.MONGODB_URI; // URI de conexión a la base de datos MongoDB, leído del .env
const client = new MongoClient(uri); 
// Crea instancia de cliente Mongo con la URI y opciones recomendadas para nueva conexión

let db; // Variable para almacenar la referencia a la base de datos ya conectada

// Función asíncrona para conectar la base de datos
async function connectDB() {
  if (!db) { // Si no existe conexión previa, crea una
    await client.connect(); // Espera la conexión establecida con MongoDB Atlas
    db = client.db(process.env.DB_NAME); // Conectar la base concreta por nombre (del .env)
    console.log('Conectado a MongoDB Atlas');
  }
  return db; // Retorna la instancia de la base conectada (cacheada para reuse)
}

module.exports = connectDB; // Exponer la función para usar en otras partes del proyecto
