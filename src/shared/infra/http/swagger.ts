import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Colecionai API",
      version: "1.0.0",
      description:
        "Complete RESTful API for collectibles marketplace with real-time auctions, authentication, and async processing.",
      contact: {
        name: "API Support",
        email: "support@colecionai.com",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Development server",
      },
      {
        url: process.env.API_URL || "https://api.colecionai.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored in HTTP-only cookie",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Error message",
            },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                  },
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            is_verified: {
              type: "boolean",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
            price: {
              type: "integer",
              description: "Price in cents",
            },
            description: {
              type: "string",
            },
            category: {
              type: "string",
              enum: [
                "ACTION_FIGURES",
                "COLLECTIBLE_STATUES",
                "FUNKO_POP",
                "TRADING_CARDS",
                "COMIC_BOOKS",
                "MANGA",
                "RETRO_GAMES",
                "MINIATURES",
                "MODEL_KITS",
                "MOVIES_TV_COLLECTIBLES",
                "ANIME_COLLECTIBLES",
                "ART_BOOKS",
                "RARE_COLLECTIBLES",
              ],
            },
            condition: {
              type: "string",
              enum: ["NEW", "USED", "OPEN_BOX"],
            },
            banner: {
              type: "string",
              nullable: true,
            },
            user_id: {
              type: "string",
              format: "uuid",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Auction: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            product_id: {
              type: "string",
              format: "uuid",
            },
            start_price: {
              type: "integer",
              description: "Starting price in cents",
            },
            start_date: {
              type: "string",
              format: "date-time",
            },
            end_date: {
              type: "string",
              format: "date-time",
            },
            status: {
              type: "string",
              enum: ["OPEN", "CLOSED", "CANCELLED"],
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Bid: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            auction_id: {
              type: "string",
              format: "uuid",
            },
            user_id: {
              type: "string",
              format: "uuid",
            },
            amount: {
              type: "integer",
              description: "Bid amount in cents",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Products",
        description: "Product CRUD operations",
      },
      {
        name: "Auctions",
        description: "Auction management endpoints",
      },
      {
        name: "Bids",
        description: "Bidding endpoints",
      },
    ],
  },
  apis: ["./src/shared/infra/http/routes/*.ts", "./src/modules/**/*Controller.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
