const User = require("../models/User");

/**
 * Récupère la liste de tous les utilisateurs.
 * Le mot de passe n’est jamais retourné.
 * @route GET /api/users
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

/**
 * Récupère un utilisateur par son identifiant.
 * Le mot de passe n’est jamais retourné.
 * @route GET /api/users/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.json(user);
};

/**
 * Crée un nouvel utilisateur.
 * Le mot de passe est stocké hashé en base de données.
 * @route POST /api/users
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  const created = await User.create(req.body);
  const safe = created.toObject();
  delete safe.password;
  res.status(201).json(safe);
};

/**
 * Met à jour un utilisateur existant.
 * Le mot de passe n’est jamais exposé dans la réponse.
 * @route PUT /api/users/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select("-password");

  if (!updated) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.json(updated);
};

/**
 * Supprime un utilisateur.
 * @route DELETE /api/users/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.status(204).send();
};
