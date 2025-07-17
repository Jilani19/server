// swagger/swaggerConfig.js
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Company Form API",
      version: "1.0.0",
      description: "API documentation for Company Form backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Company: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64c8e7d3eabc1234d56789ef"
            },
            companyName: {
              type: "string",
              example: "Mavora Tech"
            },
            website: {
              type: "string",
              example: "https://mavoratech.com"
            },
            address: {
              type: "string",
              example: "123 Tech Street, Gachibowli"
            },
            city: {
              type: "string",
              example: "Hyderabad"
            },
            zipCode: {
              type: "string",
              example: "500032"
            },
            createdBy: {
              type: "string",
              example: "admin123"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-07-16T10:15:30.000Z"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-07-16T10:15:30.000Z"
            },
            __v: {
              type: "number",
              example: 0
            }
          },
          required: [
            "companyName",
            "website",
            "address",
            "city",
            "zipCode",
            "createdBy"
          ]
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Scans route files for annotations
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
