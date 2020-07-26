// Importation du module de gestion de fichiers via requête HTTP
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

/* Configuration de multer :
    - indique où enregistrer le fichier
    - crée un nom de fichier à partir du nom d'origine et d'un timestamp
    - résout l'extension de fichier appropriée */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Exportation de multer : gère uniquement les téléchargements de fichiers "images"
module.exports = multer({ storage }).single('image');