const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  plan: { type: String, enum: ["free", "starter", "pro"], default: "free" },
  status: { type: String, enum: ["active", "suspended"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Tenant", tenantSchema);
