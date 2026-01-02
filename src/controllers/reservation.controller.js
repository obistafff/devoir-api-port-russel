const Reservation = require("../models/Reservation");

exports.getAll = async (req, res) => {
  const items = await Reservation.find().sort({ checkIn: -1 });
  res.json(items);
};

exports.getOne = async (req, res) => {
  const item = await Reservation.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Réservation introuvable" });
  res.json(item);
};

exports.create = async (req, res) => {
  const created = await Reservation.create(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "Réservation introuvable" });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await Reservation.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Réservation introuvable" });
  res.status(204).send();
};
