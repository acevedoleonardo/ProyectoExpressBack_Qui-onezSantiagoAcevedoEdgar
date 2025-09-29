// MIDDLEWARE DE VALIDACIÓN
// ============================================

const { validationResult } = require('express-validator');

// Middleware para verificar errores de validación
function validateRequest(req, res, next) {
  // Obtenemos los errores de validación
  const errors = validationResult(req);
  
  // Si hay errores, devolvemos respuesta con los errores
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }
  
  // Si no hay errores, continuamos con la siguiente función
  next();
}

module.exports = validate;