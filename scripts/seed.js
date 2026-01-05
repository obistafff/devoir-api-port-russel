require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../src/config/db");
const Catway = require("../src/models/Catway");
const Reservation = require("../src/models/Reservation");
const User = require("../src/models/User");

async function main() {
  try {
    await connectDB();

    const catwaysPath = path.join(__dirname, "..", "data", "catways.json");
    const reservationsPath = path.join(__dirname, "..", "data", "reservations.json");

    const catways = JSON.parse(fs.readFileSync(catwaysPath, "utf-8"));
    const reservations = JSON.parse(fs.readFileSync(reservationsPath, "utf-8"));

    // Nettoyage
    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    await User.deleteMany({});

    // Insert JSON
    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations);

    // ✅ User de démo pour login (EJS / dashboard)
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    await User.create({
      name: "Admin",
      email: "admin@port-russell.test",
      password: hashedPassword,
    });

    console.log("✅ Seed terminé avec succès");
    console.log("🔐 Compte de test:", "admin@port-russell.test / Admin123!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
