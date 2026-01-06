const Reservation = require("../models/Reservation");

/**
 * Récupère la liste de toutes les réservations.
 * @route GET /api/reservations
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  const items = await Reservation.find().sort({ startDate: -1 });
  res.json(items);
};

/**
 * Récupère une réservation par son identifiant.
 * @route GET /api/reservations/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getOne = async (req, res) => {
  const item = await Reservation.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Réservation introuvable" });
  res.json(item);
};

/**
 * Crée une nouvelle réservation.
 * @route POST /api/reservations
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  const created = await Reservation.create(req.body);
  res.status(201).json(created);
};

/**
 * Met à jour une réservation existante.
 * @route PUT /api/reservations/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  const updated = await Reservation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: "Réservation introuvable" });
  res.json(updated);
};

/**
 * Supprime une réservation.
 * @route DELETE /api/reservations/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  const deleted = await Reservation.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Réservation introuvable" });
  res.status(204).send();
};
