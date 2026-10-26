const { z } = require("zod");
const id = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");
const createProjectSchema = z.object({ body: z.object({
  name: z.string().trim().min(2).max(140),
  description: z.string().trim().max(2000).optional().default(""),
  status: z.enum(["active", "archived", "completed"]).optional().default("active")
}) });
const updateProjectSchema = z.object({ body: z.object({
  name: z.string().trim().min(2).max(140).optional(),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(["active", "archived", "completed"]).optional()
}).refine((body) => Object.keys(body).length > 0, "At least one field is required") });
const idSchema = z.object({ params: z.object({ id }) });
module.exports = { createProjectSchema, updateProjectSchema, idSchema };
