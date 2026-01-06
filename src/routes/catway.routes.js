const router = require("express").Router();
const ctrl = require("../controllers/catway.controller");

/**
 * @openapi
 * /api/catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags:
 *       - Catways
 *     responses:
 *       200:
 *         description: Liste des catways
 */

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
