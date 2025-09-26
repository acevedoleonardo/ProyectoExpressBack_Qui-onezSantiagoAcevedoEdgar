function errorHandler(err, req, res, next) {
  // Imprime en consola el stack trace completo del error para facilitar depuración
  console.error(err.stack);
  
  // Envía una respuesta HTTP al cliente con el código de error adecuado
  // Si err.status está definido, lo usa, si no usa 500 (error interno servidor)
  res.status(err.status || 500).json({
    message: err.message || 'Error interno en el servidor', // Envía el mensaje de error o uno genérico si no existe
  });
}

module.exports = errorHandler;
