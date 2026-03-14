import { NextRequest } from "next/server";

/**
 * Create a mock NextRequest for testing API routes
 */
export function createRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
  } = {}
): NextRequest {
  const { method = "GET", body, headers = {}, cookies = {} } = options;

  const fullUrl = url.startsWith("http") ? url : `http://localhost:3000${url}`;

  const init: RequestInit = {
    method,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  };

  if (body && method !== "GET") {
    init.body = JSON.stringify(body);
  }

  const request = new NextRequest(fullUrl, init as never);

  // Set cookies
  for (const [key, value] of Object.entries(cookies)) {
    request.cookies.set(key, value);
  }

  return request;
}

/**
 * Parse JSON response from a NextResponse
 */
export async function parseResponse<T = unknown>(
  response: Response
): Promise<{ status: number; data: T }> {
  const data = (await response.json()) as T;
  return { status: response.status, data };
}
