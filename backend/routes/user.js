// Importation d'Express
const express = require('express');

// Création du routeur
const router = express.Router();

// Importation du routeur
const userCtrl = require('../controllers/user')

// Routes d'authentification
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;