import { describe, it, expect } from "vitest";
import { validate, loginSchema, registerSchema, paginationSchema } from "@/lib/validation";

describe("validation", () => {
  describe("loginSchema", () => {
    it("should validate valid login data", () => {
      const result = validate(loginSchema, {
        identifier: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty identifier", () => {
      const result = validate(loginSchema, {
        identifier: "",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const result = validate(loginSchema, {
        identifier: "test@example.com",
        password: "12345",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("should validate valid registration data", () => {
      const result = validate(registerSchema, {
        email: "test@example.com",
        password: "password123",
        username: "testuser",
      });
      expect(result.success).toBe(true);
    });

    it("should reject short username", () => {
      const result = validate(registerSchema, {
        email: "test@example.com",
        password: "password123",
        username: "ab",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid username chars", () => {
      const result = validate(registerSchema, {
        email: "test@example.com",
        password: "password123",
        username: "test user!",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("paginationSchema", () => {
    it("should validate valid pagination", () => {
      const result = validate(paginationSchema, {
        limit: 20,
        offset: 0,
      });
      expect(result.success).toBe(true);
    });

    it("should use defaults when empty", () => {
      const result = validate(paginationSchema, {});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
        expect(result.data.offset).toBe(0);
      }
    });

    it("should reject limit over max", () => {
      const result = validate(paginationSchema, {
        limit: 500,
        offset: 0,
      });
      expect(result.success).toBe(false);
    });
  });
});
