// ============================================
// CONEXIÓN A MONGODB
// ============================================

// Importamos el cliente de MongoDB
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Obtenemos la URI de conexión desde el archivo .env
const uri = process.env.MONGODB_URI;

// Creamos el cliente de MongoDB
const client = new MongoClient(uri);

// Variable para guardar la conexión
let db;

// Función para conectar a la base de datos
async function connectDB() {
  // Si no hay conexión, creamos una nueva
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log('Conectado a MongoDB');
  }
  return db;
}

module.exports = connectDB;