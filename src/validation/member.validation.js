const { z } = require("zod");
const addMemberSchema = z.object({ body: z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(72),
  role: z.enum(["admin", "member"]).default("member")
}) });
const idSchema = z.object({ params: z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID") }) });
const roleSchema = z.object({ params: z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID") }), body: z.object({ role: z.enum(["admin", "member"]) }) });
module.exports = { addMemberSchema, idSchema, roleSchema };
