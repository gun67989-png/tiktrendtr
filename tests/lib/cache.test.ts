import { describe, it, expect } from "vitest";
import { cacheKey } from "@/lib/cache";

describe("cache", () => {
  describe("cacheKey", () => {
    it("should create a key with prefix only", () => {
      const key = cacheKey("trends:videos", {});
      expect(key).toBe("trends:videos");
    });

    it("should include sorted params", () => {
      const key = cacheKey("trends:videos", { limit: 20, offset: 0, category: "Müzik" });
      expect(key).toContain("trends:videos:");
      expect(key).toContain("category=Müzik");
      expect(key).toContain("limit=20");
      expect(key).toContain("offset=0");
    });

    it("should produce same key regardless of param order", () => {
      const key1 = cacheKey("test", { a: "1", b: "2" });
      const key2 = cacheKey("test", { b: "2", a: "1" });
      expect(key1).toBe(key2);
    });

    it("should skip undefined values", () => {
      const key = cacheKey("test", { a: "1", b: undefined });
      expect(key).not.toContain("b=");
    });
  });
});
