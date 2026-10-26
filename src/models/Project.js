const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, trim: true, maxlength: 2000, default: "" },
  status: { type: String, enum: ["active", "archived", "completed"], default: "active" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

projectSchema.index({ tenantId: 1, createdAt: -1 });
module.exports = mongoose.model("Project", projectSchema);
