const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    boatName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// endDate après startDate
reservationSchema.pre("validate", function (next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate("endDate", "endDate must be after startDate");
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
