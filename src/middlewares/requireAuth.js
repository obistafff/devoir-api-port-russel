/**
 * Middleware: protège les routes nécessitant une authentification via session.
 */
module.exports = function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/");
  next();
};