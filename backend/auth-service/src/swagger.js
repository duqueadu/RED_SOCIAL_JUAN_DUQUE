const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Auth Service',
      version: '1.0.0',
      description: 'Documentación de endpoints del servicio de autenticación',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./src/routes.js'], // Ajusta la ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger Docs disponibles en http://localhost:${process.env.PORT}/api-docs`);
}

// 👇 Exporta la función (no la ejecutes aquí)
module.exports = swaggerDocs;
