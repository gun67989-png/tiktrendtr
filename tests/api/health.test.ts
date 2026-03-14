import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("should return health status", async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("uptime");
    expect(data).toHaveProperty("timestamp");
    expect(data).toHaveProperty("services");
    expect(data.services).toHaveProperty("database");
    expect(data.services).toHaveProperty("redis");
    expect(data.services).toHaveProperty("ai");
  });

  it("should return valid timestamp", async () => {
    const response = await GET();
    const data = await response.json();

    const timestamp = new Date(data.timestamp);
    expect(timestamp.getTime()).not.toBeNaN();
  });
});
