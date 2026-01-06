const express = require("express");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middlewares/requireAuth");

const User = require("../models/User");
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
    console.error("login error:", err);
    return res.status(500).render("index", { title: "Port Russell", error: "Erreur serveur." });
  }
});

// Dashboard enrichi
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
      user: req.session.user,
      stats: {
        catways: catwaysCount,
        reservations: reservationsCount,
        users: usersCount,
      },
      lastReservations,
    });
  } catch (err) {
    console.error("dashboard error:", err);
    return res.status(500).send("Erreur dashboard");
  }
});

// ===== CATWAYS UI =====

// Liste des catways
router.get("/catways", requireAuth, async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render("catways/index", {
      title: "Catways",
      user: req.session.user,
      catways,
    });
  } catch (err) {
    console.error("catways list error:", err);
    res.status(500).send("Erreur catways");
  }
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
    console.error("catway create error:", err);
    res.status(400).render("catways/new", {
      title: "Nouveau catway",
      user: req.session.user,
      error: "Erreur : vérifie les champs (numéro unique, type short/long, état).",
    });
  }
});

// Form édition
router.get("/catways/:id/edit", requireAuth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).send("Catway introuvable");

    res.render("catways/edit", {
      title: "Modifier catway",
      user: req.session.user,
      catway,
      error: null,
    });
  } catch (err) {
    console.error("catway edit form error:", err);
    res.status(500).send("Erreur catway");
  }
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
    console.error("catway update error:", err);
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
  try {
    await Catway.findByIdAndDelete(req.params.id);
    res.redirect("/catways");
  } catch (err) {
    console.error("catway delete error:", err);
    res.status(500).send("Erreur suppression catway");
  }
});

// ===== RESERVATIONS UI =====

// Liste
router.get("/reservations", requireAuth, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startDate: -1 });
    res.render("reservations/index", {
      title: "Réservations",
      user: req.session.user,
      reservations,
    });
  } catch (err) {
    console.error("reservations list error:", err);
    res.status(500).send("Erreur réservations");
  }
});

// Form création (dropdown catways)
router.get("/reservations/new", requireAuth, async (req, res) => {
  try {
    // BONUS: proposer en priorité les catways en bon état
    const catways = await Catway.find().sort({ catwayState: 1, catwayNumber: 1 });
    res.render("reservations/new", {
      title: "Nouvelle réservation",
      user: req.session.user,
      catways,
      error: null,
    });
  } catch (err) {
    console.error("reservation new form error:", err);
    res.status(500).send("Erreur form réservation");
  }
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
    console.error("reservation create error:", err);
    const catways = await Catway.find().sort({ catwayState: 1, catwayNumber: 1 });
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
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).send("Réservation introuvable");

    const catways = await Catway.find().sort({ catwayState: 1, catwayNumber: 1 });

    res.render("reservations/edit", {
      title: "Modifier réservation",
      user: req.session.user,
      reservation,
      catways,
      error: null,
    });
  } catch (err) {
    console.error("reservation edit form error:", err);
    res.status(500).send("Erreur réservation");
  }
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
    console.error("reservation update error:", err);

    const reservation = await Reservation.findById(req.params.id);
    const catways = await Catway.find().sort({ catwayState: 1, catwayNumber: 1 });

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
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect("/reservations");
  } catch (err) {
    console.error("reservation delete error:", err);
    res.status(500).send("Erreur suppression réservation");
  }
});

// ===== USERS UI =====

// Liste
router.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await User.find().select("name email createdAt").sort({ createdAt: -1 });
    res.render("users/index", {
      title: "Users",
      user: req.session.user,
      users,
    });
  } catch (err) {
    console.error("users list error:", err);
    res.status(500).send("Erreur users");
  }
});

// Form création
router.get("/users/new", requireAuth, (req, res) => {
  res.render("users/new", {
    title: "Nouvel utilisateur",
    user: req.session.user,
    error: null,
  });
});

// Create (hash password)
router.post("/users", requireAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).render("users/new", {
        title: "Nouvel utilisateur",
        user: req.session.user,
        error: "Tous les champs sont requis.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).render("users/new", {
        title: "Nouvel utilisateur",
        user: req.session.user,
        error: "Email déjà utilisé.",
      });
    }

    const hash = bcrypt.hashSync(password, 10);
    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hash,
    });

    res.redirect("/users");
  } catch (err) {
    console.error("users create error:", err);
    res.status(400).render("users/new", {
      title: "Nouvel utilisateur",
      user: req.session.user,
      error: "Erreur : vérifie les champs.",
    });
  }
});

// Form édition
router.get("/users/:id/edit", requireAuth, async (req, res) => {
  try {
    const editUser = await User.findById(req.params.id).select("name email");
    if (!editUser) return res.status(404).send("User introuvable");

    res.render("users/edit", {
      title: "Modifier utilisateur",
      user: req.session.user,
      editUser,
      error: null,
    });
  } catch (err) {
    console.error("users edit form error:", err);
    res.status(500).send("Erreur user");
  }
});

// Update (password optionnel)
router.post("/users/:id", requireAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const editUser = await User.findById(req.params.id);
    if (!editUser) return res.status(404).send("User introuvable");

    const normalizedEmail = (email || "").toLowerCase().trim();

    // Si email change, vérifier unicité
    if (normalizedEmail && normalizedEmail !== editUser.email) {
      const exists = await User.findOne({ email: normalizedEmail });
      if (exists) {
        return res.status(400).render("users/edit", {
          title: "Modifier utilisateur",
          user: req.session.user,
          editUser: { _id: editUser._id, name, email },
          error: "Email déjà utilisé.",
        });
      }
      editUser.email = normalizedEmail;
    }

    if (name) editUser.name = name.trim();

    // Password facultatif
    if (password && password.trim().length > 0) {
      editUser.password = bcrypt.hashSync(password.trim(), 10);
    }

    await editUser.save();
    res.redirect("/users");
  } catch (err) {
    console.error("users update error:", err);

    const fallback = await User.findById(req.params.id).select("name email");
    res.status(400).render("users/edit", {
      title: "Modifier utilisateur",
      user: req.session.user,
      editUser: fallback,
      error: "Erreur : vérifie les champs.",
    });
  }
});

// Delete
router.post("/users/:id/delete", requireAuth, async (req, res) => {
  try {
    // évite de te supprimer toi-même (optionnel mais safe)
    if (String(req.session.user.id) === String(req.params.id)) {
      return res.status(400).send("Impossible de supprimer l’utilisateur connecté.");
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect("/users");
  } catch (err) {
    console.error("users delete error:", err);
    res.status(500).send("Erreur suppression user");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("logout error:", err);
      return res.status(500).send("Erreur logout");
    }
    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
});

module.exports = router;
