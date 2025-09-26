const { validationResult } = require('express-validator'); // Importa método para obtener errores de validación

function validateRequest(req, res, next) {
  const errors = validationResult(req); // Extrae los errores de validación de la solicitud

  if (!errors.isEmpty()) { // Si existen errores de validación
    return res.status(400).json({ errors: errors.array() }); // Responde con código 400 y lista de errores
  }

  next(); // Si no hay errores, pasa al siguiente middleware o controlador
}

module.exports = validateRequest;
