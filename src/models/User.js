const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
  status: { type: String, enum: ["active", "disabled"], default: "active" }
}, { timestamps: true });

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
module.exports = mongoose.model("User", userSchema);
