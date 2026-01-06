require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== Session =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  })
);

// ===== View engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== Swagger =====
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Routes UI =====
app.use("/", require("./routes/ui.routes"));

// ===== Routes API =====
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/catways", require("./routes/catway.routes"));
app.use("/api/reservations", require("./routes/reservation.routes"));

module.exports = app;
