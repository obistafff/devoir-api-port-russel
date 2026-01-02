const Catway = require("../models/Catway");

exports.getAll = async (req, res) => {
  const items = await Catway.find().sort({ catwayNumber: 1 });
  res.json(items);
};

exports.getOne = async (req, res) => {
  const item = await Catway.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Catway introuvable" });
  res.json(item);
};

exports.create = async (req, res) => {
  const created = await Catway.create(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "Catway introuvable" });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await Catway.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Catway introuvable" });
  res.status(204).send();
};
