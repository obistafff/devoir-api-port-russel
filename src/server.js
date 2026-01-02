require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json()); 
const userRoutes = require("./routes/user.routes");
const catwayRoutes = require("./routes/catway.routes");
const reservationRoutes = require("./routes/reservation.routes");

app.use("/api/users", userRoutes);
app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);


connectDB();

app.get("/", (req, res) => {
  res.send("API OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
