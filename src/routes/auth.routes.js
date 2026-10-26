const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const validate = require("../utils/validate");
const { registerSchema, loginSchema } = require("../validation/auth.validation");

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", requireAuth, controller.me);
module.exports = router;
