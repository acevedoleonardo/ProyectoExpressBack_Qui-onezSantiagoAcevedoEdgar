const passport = require('passport'); // Importa Passport para estrategias de autenticación
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'); // Importa estrategia JWT para Passport
require('dotenv').config(); // Carga variables de entorno desde .env

// Opciones para la estrategia JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el JWT del header Authorization Bearer
  secretOrKey: process.env.JWT_SECRET, // Clave secreta para validar el token, desde .env
};

// Configuración de la estrategia JWT con Passport
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  try {
    // Aquí normalmente buscarías al usuario en la base de datos con ID del payload
    // Pero este ejemplo básico solo verifica que el payload exista
    if (jwt_payload) {
      // Si el JWT es válido, se autoriza al usuario
      return done(null, jwt_payload);
    } else {
      // Si no se encuentra usuario se rechaza autenticación
      return done(null, false);
    }
  } catch (error) {
    // En caso de error se pasa al siguiente middleware de Passport
    return done(error, false);
  }
}));

module.exports = passport;
