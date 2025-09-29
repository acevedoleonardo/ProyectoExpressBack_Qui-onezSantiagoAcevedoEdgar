// ============================================
// CONFIGURACIÓN DE AUTENTICACIÓN JWT
// ============================================

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const connectDB = require('../config/db');

// Opciones para la estrategia JWT
const options = {
  // De dónde extraemos el token (del header Authorization)
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Clave secreta para verificar el token
  secretOrKey: process.env.JWT_SECRET
};

// Configuramos la estrategia de autenticación
passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      // Conectamos a la base de datos
      const db = await connectDB();
      
      // Buscamos el usuario por su ID
      const user = await db.collection('usuarios').findOne({ _id: payload.id });
      
      // Si el usuario existe, lo autenticamos
      if (user) {
        return done(null, user);
      }
      
      // Si no existe, no autenticamos
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;