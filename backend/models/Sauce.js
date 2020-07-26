// Importation de mongoose
const mongoose = require('mongoose');

// Création du schéma de donnée en fonction des clés et types attendus
const sauceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    usersLiked: {
        type: Array,
    },
    usersDisliked: {
        type: Array,
    },
});

// Exportation du modèle créé
module.exports = mongoose.model('Sauce', sauceSchema);