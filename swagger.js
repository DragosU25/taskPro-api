const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kanban Management API",
      description:
        "API pentru gestionarea utilizatorilor, proiectelor, coloanelor și cardurilor",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Project: {
          type: "object",
          properties: {
            _id: { type: "string" },
            projectName: { type: "string" },
            description: { type: "string" },
            ownerId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Column: {
          type: "object",
          properties: {
            _id: { type: "string" },
            columnName: { type: "string" },
            projectId: { type: "string" },
            order: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    paths: {
      "/auth/register": {
        post: {
          summary: "Înregistrare utilizator",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                  required: ["name", "email", "password"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Utilizator înregistrat cu succes",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "Autentificare utilizator",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Autentificare reușită",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/auth/logout": {
        post: {
          summary: "Logout utilizator",
          tags: ["Auth"],
          security: [{ BearerAuth: [] }],

          responses: {
            200: { description: "Logout realizat cu succes" },
          },
        },
      },

      "/projects": {
        get: {
          summary: "Obține toate proiectele utilizatorului",
          tags: ["Projects"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Lista proiectelor",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
        },
      },
      "/columns/{projectId}": {
        post: {
          summary: "Adaugă o coloană într-un proiect",
          tags: ["Columns"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "projectId",
              required: true,
              schema: { type: "string" },
              description: "ID-ul proiectului",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    columnName: { type: "string" },
                  },
                  required: ["columnName"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Coloană adăugată cu succes",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Column" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
module.exports = specs;
