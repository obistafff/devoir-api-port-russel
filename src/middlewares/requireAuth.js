/**
 * Middleware d'authentification
 * - UI  → redirection vers /
 * - API → réponse JSON 401
 *
 * Basé sur la présence de req.session.user
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    // Si la route est une API (préfixe /api)
    if (req.originalUrl.startsWith("/api")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    // Sinon, route UI
    return res.redirect("/");
  }

  next();
};
