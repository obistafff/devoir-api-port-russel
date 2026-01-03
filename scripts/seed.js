require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("../src/config/db");
const Catway = require("../src/models/Catway");
const Reservation = require("../src/models/Reservation");

async function main() {
  try {
    await connectDB();

    const catwaysPath = path.join(__dirname, "..", "data", "catways.json");
    const reservationsPath = path.join(__dirname, "..", "data", "reservations.json");

    const catways = JSON.parse(fs.readFileSync(catwaysPath, "utf-8"));
    const reservations = JSON.parse(fs.readFileSync(reservationsPath, "utf-8"));

    await Catway.deleteMany({});
    await Reservation.deleteMany({});

    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations);

    console.log("✅ Seed terminé avec succès");

    await mongoose.disconnect();   // 👈 LIGNE CLÉ
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
