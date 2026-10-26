const router = require("express").Router();
const controller = require("../controllers/member.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const validate = require("../utils/validate");
const { addMemberSchema, idSchema, roleSchema } = require("../validation/member.validation");

router.use(requireAuth);
router.get("/", controller.list);
router.post("/", requireRole("owner", "admin"), validate(addMemberSchema), controller.create);
router.patch("/:id/role", requireRole("owner"), validate(roleSchema), controller.updateRole);
router.delete("/:id", requireRole("owner", "admin"), validate(idSchema), controller.remove);
module.exports = router;
