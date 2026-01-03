const router = require("express").Router();
const ctrl = require("../controllers/reservation.controller");

// GET /catways/:id/reservations
router.get("/catways/:id/reservations", ctrl.getAllByCatway);

// GET /catway/:id/reservations/:idReservation
router.get("/catway/:id/reservations/:idReservation", ctrl.getOne);

// POST /catways/:id/reservations
router.post("/catways/:id/reservations", ctrl.create);

// PUT /catways/:id/reservations/:idReservation
router.put("/catways/:id/reservations/:idReservation", ctrl.update);

// DELETE /catway/:id/reservations/:idReservation
router.delete("/catway/:id/reservations/:idReservation", ctrl.remove);

module.exports = router;
