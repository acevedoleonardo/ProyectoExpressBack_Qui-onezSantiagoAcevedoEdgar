const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./server/config/cors');
const errorHandler = require('./server/middlewares/errorHandler');
const peliculasRoutes = require('./server/routes/peliculasRoutes');
const passport = require('./server/middlewares/auth');
const authRoutes = require('./server/routes/authRoutes');
const swaggerSetup = require('./server/swagger/swagger');

dotenv.config(); // Carga variables de entorno

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para CORS configurado
app.use(corsMiddleware);

// Middleware para parsear JSON en cuerpo de solicitudes
app.use(express.json());

// Inicializar Passport para autenticación
app.use(passport.initialize());

// Rutas de autenticación (login, registro, etc)
app.use('/auth', authRoutes);

// Rutas de películas protegidas con JWT
app.use('/peliculas', passport.authenticate('jwt', { session: false }), peliculasRoutes);

// Ruta para documentación Swagger en /api-docs
swaggerSetup(app);

// Middleware de manejo centralizado errores (debe ir al final)
app.use(errorHandler);

// Inicialización del servidor Express en el puerto configurado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
