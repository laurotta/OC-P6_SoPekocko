// Importation du module de création / vérification de token
const jwt = require('jsonwebtoken');

/* Vérification du token pour la protection des routes :
    - récupère le token dans le header de requête
    - contrôle le token par rapport à la clé secrète
    - extrait le userId du token
    - vérifie la présence d'un userId et s'il correspond */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'mon_TOKEN_est_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Requête non authentifiée !')
    });
  }
};