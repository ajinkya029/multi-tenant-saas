const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("../utils/slugify");

function issueToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
}

exports.register = asyncHandler(async (req, res) => {
  const { organizationName, name, email, password } = req.body;
  const base = slugify(organizationName) || "workspace";
  let slug = base, suffix = 1;
  while (await Tenant.exists({ slug })) { slug = `${base}-${suffix++}`; }
  const tenant = await Tenant.create({ name: organizationName, slug });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ tenantId: tenant._id, name, email, passwordHash, role: "owner" });
    return res.status(201).json({
      token: issueToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug, plan: tenant.plan }
    });
  } catch (error) {
    await Tenant.findByIdAndDelete(tenant._id);
    throw error;
  }
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password, tenantSlug } = req.body;
  const tenant = await Tenant.findOne({ slug: tenantSlug.toLowerCase(), status: "active" });
  if (!tenant) { const e = new Error("Invalid email, password, or workspace"); e.statusCode = 401; throw e; }
  const user = await User.findOne({ tenantId: tenant._id, email: email.toLowerCase() }).select("+passwordHash");
  const valid = user && user.status === "active" && await bcrypt.compare(password, user.passwordHash);
  if (!valid) { const e = new Error("Invalid email, password, or workspace"); e.statusCode = 401; throw e; }
  res.json({
    token: issueToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug, plan: tenant.plan }
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({
    user: { id: req.currentUser._id, name: req.currentUser.name, email: req.currentUser.email, role: req.currentUser.role },
    tenant: { id: req.currentTenant._id, name: req.currentTenant.name, slug: req.currentTenant.slug, plan: req.currentTenant.plan }
  });
});
