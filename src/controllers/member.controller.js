const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

exports.list = asyncHandler(async (req, res) => {
  const users = await User.find({ tenantId: req.auth.tenantId }).select("name email role status createdAt").sort({ createdAt: 1 });
  res.json({ data: users });
});

exports.create = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ tenantId: req.auth.tenantId, name, email, passwordHash, role });
  res.status(201).json({ data: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
});

exports.updateRole = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, tenantId: req.auth.tenantId });
  if (!user) { const e = new Error("Member not found"); e.statusCode = 404; throw e; }
  if (user.role === "owner") { const e = new Error("Owner role cannot be changed here"); e.statusCode = 400; throw e; }
  user.role = req.body.role;
  await user.save();
  res.json({ data: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

exports.remove = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, tenantId: req.auth.tenantId });
  if (!user) { const e = new Error("Member not found"); e.statusCode = 404; throw e; }
  if (user.role === "owner") { const e = new Error("The owner cannot be removed"); e.statusCode = 400; throw e; }
  await user.deleteOne();
  res.status(204).send();
});
