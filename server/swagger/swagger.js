const swaggerUi = require('swagger-ui-express'); // Middleware para servir Swagger UI
const swaggerDocument = require('./swagger.json'); // Documento JSON con la definición OpenAPI/Swagger

// Exporta una función que recibe la app Express para configurar la ruta de documentación
module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
