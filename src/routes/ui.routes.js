const express = require("express");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middlewares/requireAuth");
const User = require("../models/User");

// ✅ Ajouts pour dashboard enrichi
const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

const router = express.Router();

// Page d’accueil + formulaire login
router.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("index", { title: "Port Russell", error: null });
});

// Traitement login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .render("index", { title: "Port Russell", error: "Email et mot de passe requis." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(401)
        .render("index", { title: "Port Russell", error: "Identifiants invalides." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(401)
        .render("index", { title: "Port Russell", error: "Identifiants invalides." });
    }

    req.session.user = { id: user._id, email: user.email, name: user.name };
    return res.redirect("/dashboard");
  } catch (err) {
    return res.status(500).render("index", { title: "Port Russell", error: "Erreur serveur." });
  }
});

// ✅ Dashboard enrichi
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("fr-FR");

    const [catwaysCount, reservationsCount, usersCount, lastReservations] = await Promise.all([
      Catway.countDocuments(),
      Reservation.countDocuments(),
      User.countDocuments(),
      Reservation.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.render("dashboard", {
      title: "Dashboard",
      today,
      user: req.session.user, // ✅ IMPORTANT
      stats: {
        catways: catwaysCount,
        reservations: reservationsCount,
        users: usersCount,
      },
      lastReservations,
    });
  } catch (err) {
    return res.status(500).send("Erreur dashboard");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;

