const mongoose = require("mongoose");

/**
 * @typedef {Object} Reservation
 * @property {mongoose.Types.ObjectId} userId - Référence User
 * @property {mongoose.Types.ObjectId} catwayId - Référence Catway
 * @property {string} boatName - Nom du bateau
 * @property {Date} startDate - Début réservation
 * @property {Date} endDate - Fin réservation
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    catwayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catway",
      required: true,
      index: true,
    },
    boatName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Validation défensive : endDate doit être après startDate
reservationSchema.pre("validate", function (next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate("endDate", "endDate doit être postérieure à startDate");
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
