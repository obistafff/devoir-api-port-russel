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

// ===== CATWAYS UI =====

// Liste des catways
router.get("/catways", requireAuth, async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.render("catways/index", {
    title: "Catways",
    user: req.session.user,
    catways,
  });
});

// Form création
router.get("/catways/new", requireAuth, (req, res) => {
  res.render("catways/new", {
    title: "Nouveau catway",
    user: req.session.user,
    error: null,
  });
});

// Create
router.post("/catways", requireAuth, async (req, res) => {
  try {
    await Catway.create({
      catwayNumber: Number(req.body.catwayNumber),
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState,
    });
    res.redirect("/catways");
  } catch (err) {
    res.status(400).render("catways/new", {
      title: "Nouveau catway",
      user: req.session.user,
      error: "Erreur : vérifie les champs (numéro unique, type short/long, état).",
    });
  }
});

// Form édition
router.get("/catways/:id/edit", requireAuth, async (req, res) => {
  const catway = await Catway.findById(req.params.id);
  if (!catway) return res.status(404).send("Catway introuvable");

  res.render("catways/edit", {
    title: "Modifier catway",
    user: req.session.user,
    catway,
    error: null,
  });
});

// Update (POST pour HTML)
router.post("/catways/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Catway.findByIdAndUpdate(
      req.params.id,
      {
        catwayNumber: Number(req.body.catwayNumber),
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).send("Catway introuvable");
    res.redirect("/catways");
  } catch (err) {
    const catway = await Catway.findById(req.params.id);
    res.status(400).render("catways/edit", {
      title: "Modifier catway",
      user: req.session.user,
      catway,
      error: "Erreur : vérifie les champs (numéro unique, type short/long, état).",
    });
  }
});

// Delete
router.post("/catways/:id/delete", requireAuth, async (req, res) => {
  await Catway.findByIdAndDelete(req.params.id);
  res.redirect("/catways");
});

// ===== RESERVATIONS UI =====

// Liste
router.get("/reservations", requireAuth, async (req, res) => {
  const reservations = await Reservation.find().sort({ startDate: -1 });
  res.render("reservations/index", {
    title: "Réservations",
    user: req.session.user,
    reservations,
  });
});

// Form création (avec dropdown catways)
router.get("/reservations/new", requireAuth, async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.render("reservations/new", {
    title: "Nouvelle réservation",
    user: req.session.user,
    catways,
    error: null,
  });
});

// Create
router.post("/reservations", requireAuth, async (req, res) => {
  try {
    await Reservation.create({
      catwayNumber: Number(req.body.catwayNumber),
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    res.redirect("/reservations");
  } catch (err) {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.status(400).render("reservations/new", {
      title: "Nouvelle réservation",
      user: req.session.user,
      catways,
      error: "Erreur : vérifie les champs et les dates.",
    });
  }
});

// Form edit
router.get("/reservations/:id/edit", requireAuth, async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return res.status(404).send("Réservation introuvable");

  const catways = await Catway.find().sort({ catwayNumber: 1 });

  res.render("reservations/edit", {
    title: "Modifier réservation",
    user: req.session.user,
    reservation,
    catways,
    error: null,
  });
});

// Update
router.post("/reservations/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        catwayNumber: Number(req.body.catwayNumber),
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).send("Réservation introuvable");
    res.redirect("/reservations");
  } catch (err) {
    const reservation = await Reservation.findById(req.params.id);
    const catways = await Catway.find().sort({ catwayNumber: 1 });

    res.status(400).render("reservations/edit", {
      title: "Modifier réservation",
      user: req.session.user,
      reservation,
      catways,
      error: "Erreur : vérifie les champs et les dates.",
    });
  }
});

// Delete
router.post("/reservations/:id/delete", requireAuth, async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res.redirect("/reservations");
});


// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;

