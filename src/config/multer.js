const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Garante o caminho absoluto para a pasta uploads na raiz
        cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        // randomUUID() é síncrono e ideal para Node 22
        const hash = crypto.randomUUID();
        // Remove espaços do nome original para evitar problemas na URL
        const fileName = `${hash}-${file.originalname.replace(/\s/g, '_')}`;
        
        cb(null, fileName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Aumentei para 5MB para evitar erros bobos
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo inválido. Apenas JPG, PNG e WebP.'));
        }
    }
});

module.exports = upload;