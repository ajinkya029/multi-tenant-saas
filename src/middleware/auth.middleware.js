const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tenant = require("../models/Tenant");
const asyncHandler = require("../utils/asyncHandler");

const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    const error = new Error("Bearer token required"); error.statusCode = 401; throw error;
  }
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  let payload;
  try { payload = jwt.verify(header.slice(7), process.env.JWT_SECRET); }
  catch { const error = new Error("Invalid or expired token"); error.statusCode = 401; throw error; }

  const user = await User.findById(payload.sub).select("+passwordHash");
  if (!user || user.status !== "active") {
    const error = new Error("Account not found or disabled"); error.statusCode = 401; throw error;
  }
  const tenant = await Tenant.findById(user.tenantId);
  if (!tenant || tenant.status !== "active") {
    const error = new Error("Tenant is unavailable"); error.statusCode = 403; throw error;
  }
  req.auth = { userId: user._id, tenantId: tenant._id, role: user.role };
  req.currentUser = user;
  req.currentTenant = tenant;
  next();
});

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.auth || !roles.includes(req.auth.role)) {
    const error = new Error("Insufficient permissions"); error.statusCode = 403; return next(error);
  }
  next();
};

module.exports = { requireAuth, requireRole };
