import { z } from "zod";

// Sanitize string to prevent XSS
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const sanitizedString = (maxLen = 255) =>
  z.string().max(maxLen).transform(sanitize);

// Auth schemas
export const loginSchema = z.object({
  identifier: z.string().min(1).max(255),
  password: z.string().min(6).max(128),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir"),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

// Onboarding schema
export const onboardingSchema = z.object({
  role: z.enum(["brand", "individual"]).optional(),
  niche: z.string().max(100).optional(),
  plan: z.string().max(50).optional(),
});

// Payment schemas
export const paymentCheckoutSchema = z.object({
  type: z.enum(["single", "subscription"]),
  plan: z.enum(["lite", "standard", "enterprise"]),
});

// Contact schema
export const contactSchema = z.object({
  name: sanitizedString(100),
  email: z.string().email().max(255),
  message: sanitizedString(2000),
});

// Competitor search
export const competitorSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-zA-Z0-9_.]+$/, "Geçersiz kullanıcı adı"),
});

// Generic query params
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Validate helper
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const message = result.error.issues
    .map((i) => i.message)
    .join(", ");
  return { success: false, error: message };
}
