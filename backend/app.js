// Importation des modules utilisés
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Importation des routes pour "sauce" et "user"
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à la base de donnée MongoDB via mongoose
mongoose.connect('mongodb+srv://lpotta:n9GRz6xmsweFF2A@cluster0.szfii.mongodb.net/projet6?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création de l'application Express
const app = express();

// Définition du Cross-Origin Ressource Sharing
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Transforme le corps de la requête en JSON
app.use(bodyParser.json());

// Définition du chemin des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Définition des paramètres demandés par l'API
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;