// ============================================
// MANEJADOR DE ERRORES
// ============================================

// Middleware para capturar errores
function errorHandler(err, req, res, next) {
  // Mostramos el error en consola
  console.error('Error:', err.message);
  
  // Enviamos respuesta de error al cliente
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
}

module.exports = errorHandler;