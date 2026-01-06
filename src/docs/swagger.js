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

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
        },
      },
      schemas: {
        Catway: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a7c8f12b3a9e0012345678" },
            catwayNumber: { type: "integer", example: 12 },
            catwayType: {
              type: "string",
              enum: ["short", "long"],
              example: "long",
            },
            catwayState: { type: "string", example: "bon état" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CatwayInput: {
          type: "object",
          required: ["catwayNumber", "catwayType", "catwayState"],
          properties: {
            catwayNumber: { type: "integer", example: 12 },
            catwayType: {
              type: "string",
              enum: ["short", "long"],
              example: "short",
            },
            catwayState: {
              type: "string",
              example: "en maintenance",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

module.exports = swaggerJSDoc(options);
