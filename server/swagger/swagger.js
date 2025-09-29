// ============================================
// CONFIGURACIÓN DE SWAGGER - SANGARFLIX API
// ============================================

// Importamos la librería que nos permite mostrar la documentación
// swagger-ui-express crea una página web bonita para probar la API
const swaggerUi = require('swagger-ui-express');

// ============================================
// DOCUMENTO DE ESPECIFICACIÓN DE LA API
// ============================================
// Este objeto contiene TODA la información de nuestra API
const swaggerDocument = {
  
  // ==========================================
  // CONFIGURACIÓN GENERAL
  // ==========================================
  
  // Versión del estándar OpenAPI que usamos (como la versión de un idioma)
  openapi: '3.0.0',
  
  // Información básica que aparece en la portada de la documentación
  info: {
    title: 'SangarFlix API',                    // Nombre que aparece en grande arriba
    version: '1.0.0',                          // Versión de tu API (cambias cuando actualizas)
    description: 'API para gestión de películas, series y reseñas'  // Descripción que se ve debajo del título
  },
  
  // Lista de servidores donde está funcionando tu API
  servers: [
    {
      url: 'http://localhost:3000',             // Dirección base de tu API
      description: 'Servidor de desarrollo'    // Descripción legible del servidor
    }
  ],
  
  // ==========================================
  // DEFINICIÓN DE TODOS LOS ENDPOINTS
  // ==========================================
  
  paths: {
    
    // ==========================================
    // ENDPOINT: REGISTRO DE USUARIOS
    // ==========================================
    '/auth/register': {
      
      // Método HTTP POST (para enviar datos y crear algo)
      post: {
        
        // Título corto que aparece en la documentación
        summary: 'Registrar nuevo usuario',
        
        // Etiqueta para agrupar endpoints relacionados
        // Todos los de 'Autenticación' aparecen juntos
        tags: ['Autenticación'],
        
        // ==========================================
        // QUÉ DATOS NECESITA RECIBIR ESTE ENDPOINT
        // ==========================================
        requestBody: {
          
          // Este endpoint SÍ necesita que le envíes datos
          required: true,
          
          // Formato de los datos que acepta
          content: {
            
            // Solo acepta datos en formato JSON
            'application/json': {
              
              // Estructura exacta de los datos que espera
              schema: {
                type: 'object',             // Es un objeto (no lista, no texto)
                
                // Campos específicos que debe tener el objeto
                properties: {
                  email: { type: 'string' },     // email: debe ser texto
                  password: { type: 'string' },  // password: debe ser texto  
                  nombre: { type: 'string' }     // nombre: debe ser texto
                }
              }
            }
          }
        },
        
        // ==========================================
        // QUÉ RESPUESTAS PUEDE DEVOLVER
        // ==========================================
        responses: {
          201: { description: 'Usuario registrado' },      // Código 201 = creado exitosamente
          400: { description: 'Error de validación' }      // Código 400 = datos incorrectos
        }
      }
    },
    
    // ==========================================
    // ENDPOINT: LOGIN DE USUARIOS  
    // ==========================================
    '/auth/login': {
      
      post: {
        summary: 'Iniciar sesión',              // Título del endpoint
        tags: ['Autenticación'],               // Grupo al que pertenece
        
        // Datos que necesita para hacer login
        requestBody: {
          required: true,                      // SÍ necesita datos obligatoriamente
          content: {
            'application/json': {              // Solo acepta JSON
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },        // Email del usuario
                  password: { type: 'string' }      // Contraseña del usuario
                }
              }
            }
          }
        },
        
        // Respuestas posibles del login
        responses: {
          200: { description: 'Login exitoso' },           // 200 = todo bien, te doy el token
          401: { description: 'Credenciales incorrectas' } // 401 = usuario/contraseña mal
        }
      }
    },
    
    // ==========================================
    // ENDPOINT: GESTIÓN DE PELÍCULAS
    // ==========================================
    '/peliculas': {
      
      // ==========================================
      // GET /peliculas - VER TODAS LAS PELÍCULAS
      // ==========================================
      get: {
        summary: 'Obtener todas las películas',    // Qué hace este endpoint
        tags: ['Películas'],                      // Grupo de películas
        
        // ¡IMPORTANTE! Este endpoint necesita autenticación
        security: [{ bearerAuth: [] }],           // Necesitas token JWT
        
        responses: {
          200: { description: 'Lista de películas' }  // Te devuelvo todas las películas
        }
      },
      
      // ==========================================
      // POST /peliculas - CREAR NUEVA PELÍCULA
      // ==========================================
      post: {
        summary: 'Crear nueva película',          // Qué hace
        tags: ['Películas'],                     // Grupo
        
        // También necesita autenticación para crear
        security: [{ bearerAuth: [] }],          // Token JWT requerido
        
        // Datos que necesita para crear la película
        requestBody: {
          required: true,                        // SÍ necesita datos
          content: {
            'application/json': {
              schema: {
                type: 'object',
                
                // Campos para crear una película
                properties: {
                  titulo: { type: 'string' },         // Nombre de la película
                  descripcion: { type: 'string' },    // Sinopsis/resumen
                  categoria: { type: 'string' },      // Género (acción, drama, etc.)
                  año: { type: 'number' },            // Año de estreno (número)
                  imagen: { type: 'string' }          // URL de la imagen/poster
                }
              }
            }
          }
        },
        
        responses: {
          201: { description: 'Película creada' }  // 201 = película creada exitosamente
        }
      }
    }
  },
  
  // ==========================================
  // CONFIGURACIÓN DE SEGURIDAD/AUTENTICACIÓN
  // ==========================================
  components: {
    
    // Define los tipos de autenticación que usa la API
    securitySchemes: {
      
      // Definimos cómo funciona la autenticación JWT
      bearerAuth: {
        type: 'http',              // Tipo de autenticación HTTP
        scheme: 'bearer',          // Esquema Bearer (el que usas)
        bearerFormat: 'JWT'        // Formato específico: JWT tokens
        
        // Esto le dice a Swagger: "cuando veas security: [{ bearerAuth: [] }]
        // significa que necesitas poner: Authorization: Bearer tu_token_jwt"
      }
    }
  }
};

// ==========================================
// FUNCIÓN PARA ACTIVAR SWAGGER EN LA APP
// ==========================================

// Esta función toma tu app de Express y le agrega la documentación
function swaggerSetup(app) {
  
  // Configura la ruta /api-docs para mostrar la documentación
  // swaggerUi.serve = prepara los archivos estáticos (CSS, JS, HTML)
  // swaggerUi.setup() = crea la página web con tu documentación
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  // Ahora cuando vayas a http://localhost:3000/api-docs
  // verás una página web bonita con toda tu documentación
}

// ==========================================
// EXPORTAR LA FUNCIÓN PARA USARLA EN INDEX.JS
// ==========================================

// Exportamos la función para que index.js pueda importarla y usarla
module.exports = swaggerSetup;

// En tu index.js harías:
// const swaggerSetup = require('./server/swagger/swagger');
// swaggerSetup(app);
