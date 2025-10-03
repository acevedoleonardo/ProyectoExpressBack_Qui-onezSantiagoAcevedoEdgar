const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();
const { getDB } = require('./db');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
  const db = getDB(); // Obtiene la conexión a la base de datos
  // Busca el usuario en la colección correcta 'usuarios' usando el ObjectId del payload
  const user = await db.collection('usuarios').findOne({ _id: new require('mongodb').ObjectId(jwt_payload.id) });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
