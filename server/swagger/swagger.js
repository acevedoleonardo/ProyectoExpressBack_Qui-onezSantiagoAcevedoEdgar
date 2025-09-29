// ============================================
// CONFIGURACIÓN DE SWAGGER
// ============================================

const swaggerUi = require('swagger-ui-express');

// Documentación básica de la API
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'SangarFlix API',
    version: '1.0.0',
    description: 'API para gestión de películas, series y reseñas'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Registrar nuevo usuario',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  nombre: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuario registrado' },
          400: { description: 'Error de validación' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Iniciar sesión',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login exitoso' },
          401: { description: 'Credenciales incorrectas' }
        }
      }
    },
    '/peliculas': {
      get: {
        summary: 'Obtener todas las películas',
        tags: ['Películas'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de películas' }
        }
      },
      post: {
        summary: 'Crear nueva película',
        tags: ['Películas'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string' },
                  descripcion: { type: 'string' },
                  categoria: { type: 'string' },
                  año: { type: 'number' },
                  imagen: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Película creada' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

// Función para configurar Swagger en la app
function swaggerSetup(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = swaggerSetup;