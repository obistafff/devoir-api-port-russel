const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: { type: Number, required: true, unique: true },
    catwayType: { type: String, required: true, enum: ["short", "long"], trim: true },
    catwayState: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catway", catwaySchema);
