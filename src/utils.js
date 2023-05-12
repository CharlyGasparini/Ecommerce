import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

// Convención nomenclatura: para temas de paths __nombre
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Implementación de multer
// Almacenamiento:
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Middlewares:
const uploader = multer({
    storage,
    onError: (err, next) => {
        console.log(err),
        next();
    }
});

const parseToNumber = (req, res, next) => {
    if(typeof req.body.price === "string"){
        req.body.price === Number(req.body.price);
    }
    if(typeof req.body.stock === "string"){
        req.body.stock === Number(req.body.stock);
    }
    next();
}

export {
    __dirname,
    uploader,
    parseToNumber
};