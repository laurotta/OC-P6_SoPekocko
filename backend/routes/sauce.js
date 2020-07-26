// Importation d'Express
const express = require('express');

// Création du routeur
const router = express.Router();

// Protection des routes
const auth = require('../middleware/auth');

// Gestion des fichiers
const multer = require('../middleware/multer-config');

// Importation du routeur
const sauceCtrl = require('../controllers/sauce')

// Routes pour chaque fonction
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;