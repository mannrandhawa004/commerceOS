const json = (schema: string) => ({
  "application/json": { schema: { $ref: `#/components/schemas/${schema}` } },
});

const request = (schema: string) => ({
  required: true,
  content: json(schema),
});

const response = (description: string, schema: string) => ({
  description,
  content: json(schema),
});

const error = (description: string) => response(description, "ErrorResponse");

export const authPaths = {
  "/auth/register": {
    post: {
      tags: ["Authentication"],
      operationId: "register",
      summary: "Register a customer account",
      description: "Creates an active account and assigns the active customer role. Registration does not issue tokens; sign in after registering. Email is trimmed and lowercased.",
      requestBody: request("RegisterRequest"),
      responses: {
        "201": response("Account created", "RegisterResponse"),
        "400": error("Validation failed (VALIDATION_ERROR)"),
        "409": error("Email is already registered (DUPLICATE_RESOURCE)"),
        "503": error("The active customer role is not configured (ROLE_NOT_CONFIGURED)"),
        "500": error("Unexpected server error"),
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Authentication"],
      operationId: "login",
      summary: "Sign in and create a session",
      description: "Returns an access token valid for 15 minutes and a refresh token valid for 30 days. expiresAt is the refresh session expiry. Send the access token as a bearer token to protected endpoints.",
      requestBody: request("LoginRequest"),
      responses: {
        "200": response("Login successful", "LoginResponse"),
        "400": error("Validation failed (VALIDATION_ERROR)"),
        "401": error("Invalid email or password (INVALID_CREDENTIALS)"),
        "403": error("Account is inactive or blocked (ACCOUNT_INACTIVE)"),
        "500": error("Unexpected server error"),
      },
    },
  },
  "/auth/refresh": {
    post: {
      tags: ["Authentication"],
      operationId: "refreshToken",
      summary: "Rotate a refresh token",
      description: "Exchanges a valid refresh token for a new access token and refresh token. The old refresh token cannot be used again. The refresh session expiry is extended by 30 days.",
      requestBody: request("RefreshTokenRequest"),
      responses: {
        "200": response("Token rotated", "RefreshResponse"),
        "400": error("Validation failed (VALIDATION_ERROR)"),
        "401": error("Invalid or expired token (INVALID_REFRESH_TOKEN), inactive account (ACCOUNT_INACTIVE), or concurrent reuse (REFRESH_TOKEN_REUSED)"),
        "500": error("Unexpected server error"),
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Authentication"],
      operationId: "logout",
      summary: "Revoke a refresh session",
      description: "Revokes the session identified by the refresh token, invalidating its access token as well. This endpoint returns success even when the token is unknown or already revoked.",
      requestBody: request("RefreshTokenRequest"),
      responses: {
        "200": response("Logout successful", "LogoutResponse"),
        "400": error("Validation failed (VALIDATION_ERROR)"),
        "500": error("Unexpected server error"),
      },
    },
  },
  "/auth/me": {
    get: {
      tags: ["Authentication"],
      operationId: "getCurrentUser",
      summary: "Get the current user's profile",
      description: "Requires a valid bearer access token, an active session and an active account.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": response("User profile", "MeResponse"),
        "401": error("Missing bearer token (UNAUTHORIZED), invalid or expired access token (INVALID_ACCESS_TOKEN), or invalid session (INVALID_SESSION)"),
        "500": error("Unexpected server error"),
      },
    },
  },
};

const userFields = {
  firstName: { type: "string", example: "Asha" },
  lastName: { type: "string", example: "Sharma" },
  email: { type: "string", format: "email", example: "asha@example.com" },
};
const tokens = {
  accessToken: { type: "string", description: "JWT access token, valid for 15 minutes.", example: "eyJhbGciOiJIUzI1NiJ9.example.signature" },
  refreshToken: { type: "string", description: "Opaque refresh token; store securely and replace it after each refresh.", example: "0123456789abcdef0123456789abcdef" },
  expiresAt: { type: "string", format: "date-time", description: "Refresh session expiry, not access token expiry.", example: "2026-12-24T12:00:00.000Z" },
};
const success = (message: string, data: object) => ({
  type: "object",
  required: ["success", "message", "data"],
  properties: { success: { type: "boolean", example: true }, message: { type: "string", example: message }, data },
});

export const authSchemas = {
  RegisterRequest: {
    type: "object", required: ["firstName", "lastName", "email", "password"],
    properties: {
      firstName: { ...userFields.firstName, minLength: 2, maxLength: 50 },
      lastName: { ...userFields.lastName, minLength: 2, maxLength: 50 },
      email: userFields.email,
      password: { type: "string", format: "password", minLength: 8, description: "At least 8 characters and at most 72 UTF-8 bytes.", example: "example-password" },
    },
  },
  LoginRequest: {
    type: "object", required: ["email", "password"],
    properties: { email: userFields.email, password: { type: "string", format: "password", minLength: 1, example: "example-password" } },
  },
  RefreshTokenRequest: {
    type: "object", required: ["refreshToken"],
    properties: { refreshToken: { type: "string", minLength: 1, description: "The refresh token returned by login or the latest refresh." } },
  },
  AuthUser: {
    type: "object", required: ["id", "firstName", "lastName", "email"],
    properties: { id: { type: "string", example: "507f1f77bcf86cd799439011" }, ...userFields },
  },
  UserProfile: {
    type: "object", required: ["_id", "firstName", "lastName", "email", "status", "createdAt", "updatedAt"],
    properties: {
      _id: { type: "string", example: "507f1f77bcf86cd799439011" }, ...userFields,
      status: { type: "string", enum: ["active", "inactive", "blocked"], example: "active" },
      emailVerifiedAt: { type: "string", format: "date-time", nullable: true },
      lastLoginAt: { type: "string", format: "date-time", nullable: true },
      createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" },
      __v: { type: "integer", example: 0 },
    },
  },
  RegisterResponse: success("Account created successfully", { $ref: "#/components/schemas/AuthUser" }),
  LoginResponse: success("Login successful", {
    type: "object", required: ["user", "accessToken", "refreshToken", "expiresAt"],
    properties: { user: { $ref: "#/components/schemas/AuthUser" }, ...tokens },
  }),
  RefreshResponse: success("Token refreshed successfully", {
    type: "object", required: ["accessToken", "refreshToken", "expiresAt"], properties: tokens,
  }),
  LogoutResponse: success("Logged out successfully", { type: "object", nullable: true, example: null }),
  MeResponse: success("User profile fetched successfully", { allOf: [{ $ref: "#/components/schemas/UserProfile" }], nullable: true }),
};
