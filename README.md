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


# Elaborado Por: 

- Quiñonez Santiago 
- Acevedo Edgar 
