const { z } = require("zod");
const email = z.string().trim().email().max(254);
const password = z.string().min(10).max(72);
const registerSchema = z.object({ body: z.object({
  organizationName: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(100),
  email, password
}) });
const loginSchema = z.object({ body: z.object({
  email, password: z.string().min(1).max(72), tenantSlug: z.string().trim().min(2).max(60)
}) });
module.exports = { registerSchema, loginSchema };
