const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

exports.list = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const filter = { tenantId: req.auth.tenantId };
  if (["active", "archived", "completed"].includes(req.query.status)) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("createdBy", "name email"),
    Project.countDocuments(filter)
  ]);
  res.json({ data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

exports.create = asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, tenantId: req.auth.tenantId, createdBy: req.auth.userId });
  res.status(201).json({ data: project });
});

exports.get = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, tenantId: req.auth.tenantId }).populate("createdBy", "name email");
  if (!project) { const e = new Error("Project not found"); e.statusCode = 404; throw e; }
  res.json({ data: project });
});

exports.update = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.auth.tenantId },
    { $set: req.body }, { new: true, runValidators: true }
  );
  if (!project) { const e = new Error("Project not found"); e.statusCode = 404; throw e; }
  res.json({ data: project });
});

exports.remove = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, tenantId: req.auth.tenantId });
  if (!project) { const e = new Error("Project not found"); e.statusCode = 404; throw e; }
  res.status(204).send();
});
