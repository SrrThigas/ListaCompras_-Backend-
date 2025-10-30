// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Lista de Compras',
      version: '1.0.0',
      description: 'Documentação da API de lista de compras e usuários (Node + PostgreSQL)',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor Local' },
    ],
  },
  apis: ['./server.js'], // onde estão as rotas
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
