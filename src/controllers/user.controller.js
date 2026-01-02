const User = require("../models/User");

exports.getAll = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.json(user);
};

exports.create = async (req, res) => {
  const created = await User.create(req.body);
  const safe = created.toObject();
  delete safe.password;
  res.status(201).json(safe);
};

exports.update = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select("-password");
  if (!updated) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.status(204).send();
};
