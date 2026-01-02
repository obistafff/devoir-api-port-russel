const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) throw new Error("MONGODB_URI manquante dans .env");

  await mongoose.connect(uri);
  console.log("✅ MongoDB connectée:", mongoose.connection.name);
}

module.exports = { connectDB };
