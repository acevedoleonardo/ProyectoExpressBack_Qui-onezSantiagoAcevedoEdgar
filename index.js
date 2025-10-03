// Servidor Principal
// ==========================================

// 1. IMPORTAR LIBRERÍAS Y MÓDULOS NECESARIOS
const express = require('express'); // Framework web para Node.js
const dotenv = require('dotenv'); // Para leer variables de entorno (.env)
const connectDB = require('./server/config/db'); // Función para conectar MongoDB
const corsMiddleware = require('./server/config/cors'); // Configuración CORS
const errorHandler = require('./server/middlewares/errorHandler'); // Manejo de errores
const peliculasRoutes = require('./server/routes/peliculasRoutes'); // Rutas de películas
const passport = require('./server/middlewares/auth'); // Autenticación JWT
const authRoutes = require('./server/routes/authRoutes'); // Rutas de login/registro
const swaggerSetup = require('./server/swagger/swagger'); // Documentación API

// 2. CONFIGURAR VARIABLES DE ENTORNO
dotenv.config(); // Esto lee el archivo .env y carga las variables

// 3. CREAR LA APLICACIÓN EXPRESS
const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor (3000 por defecto)

// 4. FUNCIÓN PRINCIPAL PARA INICIAR EL SERVIDOR
async function startServer() {
  try {
    // PASO 1: Conectar a la base de datos MongoDB PRIMERO
    console.log('🔄 Conectando a MongoDB...');
    await connectDB(); // Espera que la conexión se establezca
    console.log('✅ Conexión a MongoDB establecida correctamente');
    
    // PASO 2: Configurar middlewares (solo después de conectar la BD)
    console.log('⚙️ Configurando middlewares...');
    
    // Permitir peticiones desde otros dominios (frontend)
    app.use(corsMiddleware);
    
    // Leer datos JSON del cuerpo de las peticiones
    app.use(express.json());
    
    // Inicializar sistema de autenticación
    app.use(passport.initialize());
    
    // PASO 3: Configurar las rutas de la API
    console.log('🛣️ Configurando rutas...');
    
    // Rutas para login y registro (sin autenticación)
    app.use('/auth', authRoutes);
    
    // Rutas para películas (CON autenticación JWT obligatoria)
    app.use('/peliculas', passport.authenticate('jwt', { session: false }), peliculasRoutes);
    // Posible Error de autenticacion. 

    // Ruta para ver documentación de la API
    swaggerSetup(app);
    
    // PASO 4: Middleware para manejar errores (SIEMPRE AL FINAL)
    app.use(errorHandler);
    
    // PASO 5: Iniciar el servidor web
    app.listen(PORT, () => {
      console.log('🚀 ¡Servidor iniciado correctamente!');
      console.log(`📍 Dirección: http://localhost:${PORT}`);
      console.log(`📚 Documentación: http://localhost:${PORT}/api-docs`);
      console.log('🎬 API de películas lista para usar');
    });
    
  } catch (error) {
    // Si hay algún error al conectar, mostrar mensaje y cerrar programa
    console.error('❌ Error fatal al iniciar servidor:', error.message);
    console.error('💡 Verifica tu conexión a MongoDB y variables de entorno');
    process.exit(1); // Terminar el programa con error
  }
}

// 6. EJECUTAR LA FUNCIÓN PRINCIPAL
startServer();

// ==========================================
// NOTAS
// - Este archivo es el punto de entrada de la aplicación
// - Primero conecta a la base de datos, luego configura todo lo demás
// - Si MongoDB falla, el servidor no arranca (es lo correcto)
// - Los middlewares se ejecutan en orden, por eso el orden importa
// ==========================================
