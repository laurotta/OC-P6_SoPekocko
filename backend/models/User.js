// Importation des modules nécessaires
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma de donnée en fonction des clés et types attendus
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Garantit 1 @mail = 1 seul utilisateur
userSchema.plugin(uniqueValidator);

// Exportation du modèle créé
module.exports = mongoose.model('User', userSchema);