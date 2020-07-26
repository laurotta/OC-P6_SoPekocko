// Importation du modèle
const Sauce = require('../models/Sauce');

// Importation du module "file system" nécessaire pour la fonction deleteSauce
const fs = require('fs');

/* Création d'une sauce :
    - récupère tous les champs de l'objet
    - crée l'URL de l'image
    - enregistre dans la base de données */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
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

/* Modification d'une sauce :
    - vérifie s'il y a une nouvelle image, génère l'URL si oui
    - trouve l'objet à modifier
    - récupère la nouvelle version de l'objet */
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

/* Suppression d'une sauce :
    - trouve l'objet à supprimer
    - récupère le nom du fichier image à partir de son l'URL
    - supprime le fichier
    - supprime l'objet */
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

/* Affichage d'une sauce :
    - trouve l'objet correspondant dans la base de données
    - retourne l'objet */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

/* Affichage de toutes les sauces :
    - trouve tous les objets de la base de données
    - retourne les objets */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

// Like/dislike une sauce
exports.likeDislike = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    /* si l'utilisateur like : 
        - ajoute un like
        - met l'utilisateur dans le tableau des likes */
    if (like === 1) {
        Sauce.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    likes: 1
                },
                $push: {
                    usersLiked: userId
                }
            })
            .then(() => res.status(200).json({
                message: 'Like ajouté'
            }))
            .catch(error => res.status(400).json({
                error
            }));
    
    /* si l'utilisateur dislike :
        - ajoute un dislike
        - met l'utilisateur dans le tableau des dislikes */
    } else if (like === -1) {
        Sauce.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    dislikes: 1
                },
                $push: {
                    usersDisliked: userId
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

                // si l'utilisateur est dans le tableau des likes : utilisateur et like retirés
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $pull: {
                                usersLiked: userId
                            },
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

                // si l'utilisateur est dans le tableau des dislikes : utilisateur et dislike retirés
                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            $pull: {
                                usersDisliked: userId
                            },
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