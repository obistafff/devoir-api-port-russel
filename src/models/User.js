const mongoose = require("mongoose");

/**
 * @typedef {Object} User
 * @property {string} email - Email unique
 * @property {string} passwordHash - Mot de passe hashé (jamais en clair)
 * @property {"user"|"admin"} role - Rôle de l'utilisateur
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
