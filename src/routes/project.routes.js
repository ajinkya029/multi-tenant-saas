const router = require("express").Router();
const controller = require("../controllers/project.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const validate = require("../utils/validate");
const { createProjectSchema, updateProjectSchema, idSchema } = require("../validation/project.validation");

router.use(requireAuth);
router.get("/", controller.list);
router.post("/", validate(createProjectSchema), controller.create);
router.get("/:id", validate(idSchema), controller.get);
router.patch("/:id", validate(idSchema), validate(updateProjectSchema), controller.update);
router.delete("/:id", validate(idSchema), controller.remove);
module.exports = router;
