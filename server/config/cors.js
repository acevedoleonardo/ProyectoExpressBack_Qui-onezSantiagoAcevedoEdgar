// ============================================
// CONFIGURACIÓN DE CORS
// ============================================

// Importamos el módulo cors
const cors = require('cors');

// Configuración básica de CORS
const corsOptions = {
  // Permitimos peticiones desde el frontend local
  origin: 'http://localhost:5500', // Puerto típico de Live Server
  // Permitimos credenciales
  credentials: true,
  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Headers permitidos
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Exportamos el middleware de CORS configurado
module.exports = cors(corsOptions);