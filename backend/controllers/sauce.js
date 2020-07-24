const Sauce = require('../models/Sauce');
const fs = require('fs');

// Créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Sauce supprimée !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            })
        })
        .catch(error => res.status(500).json({
            error
        }));


};

// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

// Like/dislike une sauce
exports.likeDislike = (req, res, next) => {

    // si l'utilisateur like
    if (req.body.like === 1) {
        Sauce.updateOne({
                _id: req.params.id
            }, {

                // on ajoute un like
                $inc: {
                    likes: 1
                },

                // on ajoute l'utilisateur dans le tableau des likes
                $push: {
                    usersLiked: req.body.userId
                }
            })
            .then(() => res.status(200).json({
                message: 'Like ajouté'
            }))
            .catch(error => res.status(400).json({
                error
            }));
    
    // si l'utilisateur dislike
    } else if (req.body.like === -1) {
        Sauce.updateOne({
                _id: req.params.id
            }, {

                // on ajoute un dislike
                $inc: {
                    dislikes: 1
                },

                // on ajoute l'utilisateur dans le tableau des dislikes
                $push: {
                    usersDisliked: req.body.userId
                }
            })
            .then(() => res.status(200).json({
                message: 'Dislike ajouté'
            }))
            .catch(error => res.status(400).json({
                error
            }));

    // si l'utilisateur change d'avis
    } else {
        Sauce.findOne({
                _id: req.params.id
            })
            .then(sauce => {

                // si l'utilisateur est dans le tableau des likes
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {

                            // on retire l'utilisateur du tableau
                            $pull: {
                                usersLiked: req.body.userId
                            },

                            // on enlève un like
                            $inc: {
                                likes: -1
                            }
                        })
                        .then(() => {
                            res.status(200).json({
                                message: 'Like retiré'
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }))

                // si l'utilisateur est dans le tableau des dislikes
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {

                            // on retire l'utilisateur du tableau
                            $pull: {
                                usersDisliked: req.body.userId
                            },

                            // on enlève un dislike
                            $inc: {
                                dislikes: -1
                            }
                        })
                        .then(() => {
                            res.status(200).json({
                                message: 'Dislike retiré'
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }))
                }
            })
            .catch(error => res.status(400).json({
                error
            }));
    }
};