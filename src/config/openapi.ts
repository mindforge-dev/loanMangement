import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { env } from "./env";

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Define Bearer Auth
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// Helper to generate the spec
export const generateOpenApiSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Loan Management API",
      description: "API documentation for the Loan Management System",
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
  });
};
