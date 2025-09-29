# Backend Proyecto Express 

# Sangarflix 

El presente proyecto backend está construido sobre Node.js utilizando el framework Express para la creación de una API REST eficiente y escalable. La arquitectura sigue un patrón modular que separa configuraciones, controladores, rutas y middlewares para facilitar el mantenimiento y la escalabilidad del proyecto.

Se utiliza MongoDB Atlas como base de datos NoSQL, aprovechando su modelo flexible de documentos JSON para almacenar información del catálogo de películas. La conexión a la base de datos se gestiona mediante el driver oficial de MongoDB, con una estrategia que asegura una única conexión reutilizable para optimizar recursos.

Para la seguridad y control de acceso, se implementa autenticación basada en tokens JWT, gestionada con Passport.js, que ofrece un mecanismo robusto y estandarizado para la validación de usuarios y protección de rutas críticas. Además, las entradas de usuario son validadas con express-validator para prevenir datos inconsistentes y ataques comunes.

La documentación de la API es generada con el estándar OpenAPI y servida con Swagger UI, facilitando la interacción y prueba de los endpoints para desarrolladores y testers.

Finalmente, el proyecto incluye prácticas recomendadas para la configuración y manejo de variables de entorno mediante dotenv (en tu caso extendido con dotenvx para seguridad avanzada), así como un manejo centralizado de errores para mejorar la estabilidad y trazabilidad del sistema.

# Tecologias Utilizadas 

Este backend se construyó utilizando tecnologías modernas y robustas, enfocadas en rendimiento, escalabilidad y seguridad:

- Node.js
Entorno de ejecución JavaScript en el servidor, basado en el motor V8 de Chrome. Permite construir aplicaciones de red altamente -escalables y rápidas usando programación asíncrona y basada en eventos.

- Express.js
Framework web minimalista y flexible para Node.js que facilita la creación de servidores, gestión de rutas y middleware, simplificando el desarrollo de APIs RESTful.

- MongoDB Atlas
Base de datos NoSQL orientada a documentos, basada en BSON (similar a JSON). MongoDB ofrece alta flexibilidad para modelar datos y escalabilidad horizontal en la nube. Atlas es su servicio completamente gestionado para despliegues seguros y automáticos en la nube.

- Passport.js con JWT
Middleware para Node.js que administra la autenticación con diferentes estrategias. JWT (JSON Web Token) permite la autenticación sin estado, ideal para APIs REST, asegurando accesos con tokens firmados.

- express-validator
Middleware para validar y sanitizar la entrada del usuario en los endpoints, previniendo datos corruptos o ataques de inyección.

- Swagger UI (OpenAPI)
Herramienta para generar documentación interactiva y visual de la API, permitiendo probar en tiempo real los endpoints, mejorando la colaboración y pruebas.

- bcrypt
Biblioteca para el hash seguro de contraseñas usando sal y algoritmos robustos, dificultando ataques por fuerza bruta.

- dotenv / dotenvx
Utilizado para la gestión segura y flexible de variables de entorno, con extensión para encriptación avanzada (dotenvx), mejorando la seguridad del manejo de secretos y configuraciones sensibles.

Estas tecnologías combinadas proveen un backend robusto, escalable y seguro, preparado para integrarse con frontend modernos y brindar una experiencia consistente y confiable.

# Estructura del Proyecto 

El proyecto sigue una estructura modular clara que facilita la escalabilidad, mantenimiento y separación de responsabilidades. A continuación se describe la organización principal de carpetas y archivos: 

server/
  config/
    db.js               # Configuración y conexión a MongoDB Atlas
    cors.js             # Middleware para gestión de CORS
  controllers/
    peliculasController.js  # Lógica de negocio y manejo de solicitudes para películas
    authController.js       # Lógica de autenticación y usuarios (opcional)
  middlewares/
    auth.js              # Middleware Passport para autenticación con JWT
    errorHandler.js      # Middleware global para manejo de errores
    validateRequest.js   # Middleware para validación de peticiones HTTP
  routes/
    peliculasRoutes.js   # Definición de rutas para el catálogo de películas
    authRoutes.js        # Rutas para autenticación (login)
  swagger/
    swagger.js           # Configuración de Swagger UI para documentación
    swagger.json         # Definición OpenAPI/Swagger de los endpoints
index.js                # Entrada principal de la aplicación (configuración del servidor)
.env                    # Archivo para variables de entorno sensibles (no en repositorio)
 
## Descripción

- config/: Contiene configuraciones externas y de infraestructura como la conexión con la base de datos y políticas de CORS.

- controllers/: Contiene la lógica de negocio que responde a las solicitudes HTTP, separando la capa de presentación (rutas) de la lógica real.

- middlewares/: Middlewares personalizados para funcionalidades comunes como autenticación, validación y manejo de errores.

- routes/: Define las rutas para las diferentes partes del backend, delegando la lógica a los controladores correspondientes.

- swagger/: Archivos relacionados con la documentación de la API que permiten exploración y prueba interactivas.

- index.js: Arranca el servidor y aplica todos los middlewares y rutas configuradas.

- .env: Archivo local para variables sensibles como credenciales y claves secretas. Excluido del repositorio para seguridad.

Esta estructura permite un desarrollo ordenado, pruebas más simples y mantenimiento sencillo a medida que el proyecto crece.

# Variables de Entorno 

Las variables de entorno permiten configurar parámetros sensibles y específicos del entorno donde se ejecuta la aplicación, sin modificar el código fuente, facilitando la portabilidad y seguridad.

Este proyecto utiliza el paquete dotenv (y su extensión dotenvx para mayor seguridad) para gestionar las variables definidas en un archivo .env en la raíz del proyecto. Estas variables se cargan automáticamente al iniciar la aplicación y están accesibles mediante process.env.

Variables necesarias para este proyecto: 

MONGODB_URI=  # URI de conexión a MongoDB Atlas (incluye usuario, contraseña y cluster)
DB_NAME=      # Nombre de la base de datos que usará la aplicación
PORT=         # Puerto en donde el servidor Express escuchará las peticiones HTTP
JWT_SECRET=   # Clave secreta para la generación y validación de tokens JWT

# Instalacion y configuracion 

## Requisitos previos

1. Tener instalado Node.js (versión 18 o superior recomendada)

2. Tener acceso a MongoDB Atlas o instancia de MongoDB

3. Editor de código (Visual Studio Code recomendado)

4. Terminal o consola para ejecutar comandos.

## Pasos para la instalacion 

1. Clonar el repositorio 
consola: git clone <url-del-repositorio>

2. Acceder al directorio del proyecto 
consola: cd ProyectoExpress

3. Instalar dependencias 
consola: npm install 

4. Configurar variables de entorno
    - Crear archivo .env en la raiz del proyecto 
    - Añadir las variables necesarias con sus valores: 
        {
        MONGODB_URI=tu-cadena-de-conexion-mongodb
        DB_NAME=nombre_base_datos
        PORT=3000
        JWT_SECRET=clave_ultrasecreta
        }

5. Iniciar el servidor 
Consola: node index.js 

6. Verificar que el servidor esté corriendo 
consola: Servidor corriendo en puerto 3000

//////////////////////////////////////////////////////////////

# SangarFlix API - Backend

API REST para gestión de películas, series y reseñas desarrollada con Node.js y Express.

## Tecnologías

- Node.js
- Express
- MongoDB
- JWT (Autenticación)
- Swagger (Documentación)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install

---

## Descripción Detallada

### 📁 **server/config/**
Archivos de configuración global del servidor.

#### `cors.js`
- Configura las políticas CORS (Cross-Origin Resource Sharing)
- Permite que el frontend se comunique con el backend
- Define qué dominios pueden hacer peticiones a la API

#### `db.js`
- Maneja la conexión a MongoDB Atlas
- Implementa patrón Singleton para reutilizar la conexión
- Exporta función para obtener instancia de la base de datos

#### `passport.js`
- Configura la estrategia de autenticación JWT
- Define cómo se validan los tokens de usuario
- Extrae el token del header Authorization

---

### 📁 **server/controllers/**
Contiene la lógica de negocio de cada recurso.

#### `peliculasController.js`
- Funciones para CRUD de películas
- Validaciones de datos
- Interacción con la base de datos
- Cálculo de promedios y estadísticas

**Funciones principales:**
- `obtenerPeliculas()` - Lista todas las películas
- `obtenerPeliculaPorId()` - Busca película específica
- `crearPelicula()` - Registra nueva película
- `actualizarPelicula()` - Modifica datos de película
- `eliminarPelicula()` - Borra película

---

### 📁 **server/middlewares/**
Funciones intermedias que procesan peticiones antes de llegar a los controladores.

#### `auth.js`
- Middleware de autenticación con Passport.js
- Verifica que el token JWT sea válido
- Extrae información del usuario autenticado
- Protege rutas que requieren login

#### `errorHandler.js`
- Captura todos los errores de la aplicación
- Formatea respuestas de error consistentes
- Registra errores en consola
- Devuelve códigos HTTP apropiados

#### `validateRequest.js`
- Valida datos de entrada usando express-validator
- Verifica que los campos requeridos existan
- Valida formato de emails, contraseñas, etc.
- Devuelve errores de validación al cliente

---

### 📁 **server/routes/**
Define los endpoints de la API y conecta con controladores.

#### `authRoutes.js`
Rutas de autenticación (públicas):
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

#### `peliculasRoutes.js`
Rutas de películas (protegidas con JWT):
- `GET /peliculas` - Listar todas
- `GET /peliculas/:id` - Ver una específica
- `POST /peliculas` - Crear nueva
- `PUT /peliculas/:id` - Actualizar
- `DELETE /peliculas/:id` - Eliminar

---

### 📁 **server/swagger/**
Documentación interactiva de la API.

#### `swagger.js`
- Configura Swagger UI
- Define esquema OpenAPI 3.0
- Documenta todos los endpoints
- Describe parámetros, respuestas y autenticación
- Accesible en: `http://localhost:3000/api-docs`

---

### 📄 **Archivos raíz**

#### `index.js`
- Punto de entrada principal
- Inicializa Express
- Configura middlewares globales
- Define rutas principales
- Inicia el servidor HTTP

#### `package.json`
- Lista de dependencias del proyecto
- Scripts de ejecución (dev, start, setup)
- Metadatos del proyecto
- Comandos npm disponibles

#### `.env`
Variables de entorno sensibles


# Elaborado Por: 

- Quiñonez Santiago 
- Acevedo Edgar 
