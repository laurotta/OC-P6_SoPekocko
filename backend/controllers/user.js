const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/; // au moins une lettre et un chiffre, min. 8 caractères max. 12

// Création d'un utilisateur
exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!emailRegEx.test(email)) {
        return res.status(400).json({
            error: 'Format d\'email incorrect'
        })
    } else if (!passwordRegEx.test(password)) {
        return res.status(400).json({
            error: 'Le mot de passe doit être composé de 8 à 12 caratère et comporter au moins une lettre et un chiffre'
        })
    } else {
        bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }))
    }
};

// Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            'mon_TOKEN_est_SECRET',
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }))
        })
        .catch(error => res.status(500).json({
            error
        }))
};