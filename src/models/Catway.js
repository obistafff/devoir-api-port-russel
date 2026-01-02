const mongoose = require("mongoose");

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Numéro unique du catway
 * @property {string} type - "long" | "short"
 * @property {string} state - État / commentaire
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    type: {
      type: String,
      required: true,
      enum: ["long", "short"],
    },
    state: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catway", catwaySchema);
