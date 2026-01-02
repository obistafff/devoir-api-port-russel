const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    catwayType: {
      type: String,
      required: true,
      enum: ["long", "short"],
      trim: true,
      lowercase: true,
    },
    catwayState: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catway", catwaySchema);
