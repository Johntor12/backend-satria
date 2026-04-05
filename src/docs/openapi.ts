import { OpenAPIV3 } from "openapi-types";

const errorResponse: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["success", "message"],
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Internal server error" },
    error: {
      oneOf: [{ type: "string" }, { type: "object", additionalProperties: true }],
    },
  },
};

const baseOpenApiDocument: Omit<OpenAPIV3.Document, "servers"> = {
  openapi: "3.0.3",
  info: {
    title: "Satria Backend API",
    version: "1.0.0",
    description:
      "Interactive API documentation for authentication, company collections, bookmarks, and health endpoints.",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Paste only the raw JWT token here. Swagger will add the Bearer prefix automatically.",
      },
    },
    schemas: {
      ErrorResponse: errorResponse,
      HealthResponse: {
        type: "object",
        required: ["success", "message", "timestamp", "database", "databaseTime"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Server is healthy" },
          timestamp: { type: "string", format: "date-time" },
          database: { type: "string", example: "connected" },
          databaseTime: { type: "string", format: "date-time" },
        },
      },
      AuthUser: {
        type: "object",
        required: ["id", "email", "username"],
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", format: "email", example: "user@example.com" },
          username: { type: "string", example: "seeduser" },
          fullName: { type: "string", nullable: true, example: "Seed User" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthEnvelope: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login successful" },
          data: {
            type: "object",
            required: ["user", "token"],
            properties: {
              user: { $ref: "#/components/schemas/AuthUser" },
              token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            },
          },
        },
      },
      CurrentUserResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/AuthUser" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["email", "username", "password"],
        properties: {
          email: { type: "string", format: "email" },
          username: { type: "string" },
          password: { type: "string", format: "password" },
          fullName: { type: "string" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      RiskTier: {
        type: "string",
        enum: ["Critical", "High", "Medium", "Low"],
      },
      BookmarkStatus: {
        type: "string",
        enum: ["Active", "Archived"],
      },
      CompanyCollection: {
        type: "object",
        required: [
          "id",
          "userId",
          "companyName",
          "companyNickname",
          "sector",
          "riskScore",
          "riskTier",
          "methods",
          "revenue",
          "etr_score",
          "margin_score",
          "rp_haven_score",
          "debt_score",
          "ownership_score",
          "conduct_score",
          "persistence_multiplier",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "integer", example: 27 },
          userId: { type: "integer", example: 1 },
          companyName: { type: "string", example: "TechCorp Industries" },
          companyNickname: { type: "string", example: "TechCorp" },
          sector: { type: "string", example: "Technology" },
          riskScore: { type: "integer", example: 85, readOnly: true },
          riskTier: { $ref: "#/components/schemas/RiskTier" },
          methods: { type: "array", items: { type: "string" } },
          revenue: { type: "integer", example: 2500000 },
          etr_score: { type: "number", format: "double", example: 8.5 },
          margin_score: { type: "number", format: "double", example: 7.2 },
          rp_haven_score: { type: "number", format: "double", example: 9.1 },
          debt_score: { type: "number", format: "double", example: 6.8 },
          ownership_score: { type: "number", format: "double", example: 8.9 },
          conduct_score: { type: "number", format: "double", example: 7.5 },
          persistence_multiplier: { type: "number", format: "double", example: 1.2 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CompanyCollectionCreateRequest: {
        type: "object",
        required: ["companyName", "companyNickname", "sector", "methods"],
        properties: {
          companyName: { type: "string" },
          companyNickname: { type: "string" },
          sector: { type: "string" },
          methods: { type: "array", items: { type: "string" } },
          revenue: { type: "integer", example: 2500000 },
          etr_score: { type: "number", format: "double" },
          margin_score: { type: "number", format: "double" },
          rp_haven_score: { type: "number", format: "double" },
          debt_score: { type: "number", format: "double" },
          ownership_score: { type: "number", format: "double" },
          conduct_score: { type: "number", format: "double" },
          persistence_multiplier: { type: "number", format: "double" },
        },
      },
      CompanyCollectionUpdateRequest: {
        type: "object",
        properties: {
          companyName: { type: "string" },
          companyNickname: { type: "string" },
          sector: { type: "string" },
          methods: { type: "array", items: { type: "string" } },
          revenue: { type: "integer" },
          etr_score: { type: "number", format: "double" },
          margin_score: { type: "number", format: "double" },
          rp_haven_score: { type: "number", format: "double" },
          debt_score: { type: "number", format: "double" },
          ownership_score: { type: "number", format: "double" },
          conduct_score: { type: "number", format: "double" },
          persistence_multiplier: { type: "number", format: "double" },
        },
      },
      CompanyCollectionResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/CompanyCollection" },
        },
      },
      CompanyCollectionListResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/CompanyCollection" },
          },
        },
      },
      BookmarkCompany: {
        type: "object",
        required: ["id", "bookmarkId", "companyId", "bookmarkedAt", "createdAt", "updatedAt", "company"],
        properties: {
          id: { type: "integer", example: 1 },
          bookmarkId: { type: "integer", example: 2 },
          companyId: { type: "integer", example: 27 },
          bookmarkedAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          company: { $ref: "#/components/schemas/CompanyCollection" },
        },
      },
      Bookmark: {
        type: "object",
        required: ["id", "userId", "name", "status", "createdAt", "updatedAt", "companies"],
        properties: {
          id: { type: "integer", example: 2 },
          userId: { type: "integer", example: 1 },
          name: { type: "string", example: "High priority review" },
          description: { type: "string", nullable: true },
          status: { $ref: "#/components/schemas/BookmarkStatus" },
          notes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          companies: {
            type: "array",
            items: { $ref: "#/components/schemas/BookmarkCompany" },
          },
        },
      },
      BookmarkCreateRequest: {
        type: "object",
        required: ["name", "companyIds"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          companyIds: {
            type: "array",
            minItems: 1,
            items: { type: "integer" },
          },
          status: { $ref: "#/components/schemas/BookmarkStatus" },
          notes: { type: "string" },
        },
      },
      BookmarkUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          companyIds: {
            type: "array",
            minItems: 1,
            items: { type: "integer" },
          },
          status: { $ref: "#/components/schemas/BookmarkStatus" },
          notes: { type: "string" },
        },
      },
      BookmarkResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Bookmark" },
        },
      },
      BookmarkListResponse: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Bookmark" },
          },
        },
      },
      CompaniesByStatusResponse: {
        type: "object",
        required: ["success", "status", "data"],
        properties: {
          success: { type: "boolean", example: true },
          status: { $ref: "#/components/schemas/BookmarkStatus" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/CompanyCollection" },
          },
        },
      },
      SuccessMessageResponse: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Deleted successfully" },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service and database are healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
          "500": {
            description: "Database connectivity failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthEnvelope" },
              },
            },
          },
          "400": { description: "Missing required fields", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Email or username already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthEnvelope" },
              },
            },
          },
          "400": { description: "Missing email or password", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Invalid email or password", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user loaded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CurrentUserResponse" },
              },
            },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/company-collections": {
      get: {
        tags: ["Company Collections"],
        summary: "List company collections for the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Company collections returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CompanyCollectionListResponse" },
              },
            },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Company Collections"],
        summary: "Create a company collection",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompanyCollectionCreateRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Company collection created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CompanyCollectionResponse" },
              },
            },
          },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/company-collections/{id}": {
      get: {
        tags: ["Company Collections"],
        summary: "Get a company collection by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Company collection returned", content: { "application/json": { schema: { $ref: "#/components/schemas/CompanyCollectionResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Company Collections"],
        summary: "Update a company collection",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompanyCollectionUpdateRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Company collection updated", content: { "application/json": { schema: { $ref: "#/components/schemas/CompanyCollectionResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Company Collections"],
        summary: "Delete a company collection",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Company collection deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessMessageResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/bookmarks": {
      get: {
        tags: ["Bookmarks"],
        summary: "List bookmarks for the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Bookmarks returned", content: { "application/json": { schema: { $ref: "#/components/schemas/BookmarkListResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Bookmarks"],
        summary: "Create a bookmark",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookmarkCreateRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Bookmark created", content: { "application/json": { schema: { $ref: "#/components/schemas/BookmarkResponse" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "One or more companies not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/bookmarks/{id}": {
      get: {
        tags: ["Bookmarks"],
        summary: "Get a bookmark by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Bookmark returned", content: { "application/json": { schema: { $ref: "#/components/schemas/BookmarkResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Bookmark not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Bookmarks"],
        summary: "Update a bookmark",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookmarkUpdateRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Bookmark updated", content: { "application/json": { schema: { $ref: "#/components/schemas/BookmarkResponse" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Bookmark or related companies not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Bookmarks"],
        summary: "Delete a bookmark",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Bookmark deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessMessageResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Bookmark not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/bookmarks/status/{status}": {
      get: {
        tags: ["Bookmarks"],
        summary: "List bookmarks by status",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "path",
            required: true,
            schema: { $ref: "#/components/schemas/BookmarkStatus" },
          },
        ],
        responses: {
          "200": { description: "Bookmarks returned", content: { "application/json": { schema: { $ref: "#/components/schemas/BookmarkListResponse" } } } },
          "400": { description: "Invalid status", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/bookmarks/companies/status/{status}": {
      get: {
        tags: ["Bookmarks"],
        summary: "List unique companies referenced by bookmarks of a given status",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "path",
            required: true,
            schema: { $ref: "#/components/schemas/BookmarkStatus" },
          },
        ],
        responses: {
          "200": { description: "Companies returned", content: { "application/json": { schema: { $ref: "#/components/schemas/CompaniesByStatusResponse" } } } },
          "400": { description: "Invalid or missing status", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
  },
};

export const buildOpenApiDocument = (serverUrl: string): OpenAPIV3.Document => ({
  ...baseOpenApiDocument,
  servers: [{ url: serverUrl, description: "Current server" }],
});
