import { describe, it, expect } from "vitest";
import { generateCsrfToken, validateCsrf } from "@/lib/csrf";
import { NextRequest } from "next/server";

describe("csrf", () => {
  describe("generateCsrfToken", () => {
    it("should generate a 32-char token", () => {
      const token = generateCsrfToken();
      expect(token).toHaveLength(32);
    });

    it("should generate unique tokens", () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("validateCsrf", () => {
    it("should pass for GET requests", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
      });
      expect(validateCsrf(request)).toBe(true);
    });

    it("should pass for HEAD requests", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "HEAD",
      });
      expect(validateCsrf(request)).toBe(true);
    });

    it("should fail for POST without tokens", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
      });
      expect(validateCsrf(request)).toBe(false);
    });

    it("should fail when tokens don't match", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        headers: { "x-csrf-token": "token-a" },
      });
      request.cookies.set("csrf-token", "token-b");
      expect(validateCsrf(request)).toBe(false);
    });

    it("should pass when tokens match", () => {
      const token = generateCsrfToken();
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        headers: { "x-csrf-token": token },
      });
      request.cookies.set("csrf-token", token);
      expect(validateCsrf(request)).toBe(true);
    });
  });
});
