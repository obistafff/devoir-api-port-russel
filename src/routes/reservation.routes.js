const router = require("express").Router();
const ctrl = require("../controllers/reservation.controller");

/**
 * @openapi
 * /api/reservations:
 *   get:
 *     summary: Liste toutes les réservations
 *     tags:
 *       - Reservations
 *     responses:
 *       200:
 *         description: Liste des réservations
 */

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;