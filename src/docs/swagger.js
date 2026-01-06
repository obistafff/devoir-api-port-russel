const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Port Russell API",
      version: "1.0.0",
      description:
        "API REST pour la gestion des catways, réservations et utilisateurs du port de Russell",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

module.exports = swaggerJSDoc(options);
