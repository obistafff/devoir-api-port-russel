const Catway = require("../models/Catway");

/**
 * Récupère la liste de tous les catways.
 * @route GET /api/catways
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  const items = await Catway.find().sort({ catwayNumber: 1 });
  res.json(items);
};

/**
 * Récupère un catway par son identifiant.
 * @route GET /api/catways/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getOne = async (req, res) => {
  const item = await Catway.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Catway introuvable" });
  res.json(item);
};

/**
 * Crée un nouveau catway.
 * @route POST /api/catways
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  const created = await Catway.create(req.body);
  res.status(201).json(created);
};

/**
 * Met à jour un catway existant.
 * @route PUT /api/catways/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  const updated = await Catway.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: "Catway introuvable" });
  res.json(updated);
};

/**
 * Supprime un catway.
 * @route DELETE /api/catways/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  const deleted = await Catway.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Catway introuvable" });
  res.status(204).send();
};
