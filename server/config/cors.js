const cors = require('cors'); // Importa el paquete CORS para Express

// Define opciones de CORS, en este caso permitir solo peticiones desde un origen específico
const corsOptions = {
  origin: 'http://localhost:3001', // URL del frontend (puedes cambiarlo a la URL real)
  optionsSuccessStatus: 200 // Para dar soporte a navegadores antiguos que requieren status 200 en OPTIONS
};

// Exporta el middleware configurado para usar en el app.js o index.js
module.exports = cors(corsOptions);
