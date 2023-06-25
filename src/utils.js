import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from 'jsonwebtoken';

const PRIVATE_KEY = 'secretCoder';

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

// Funciones de bcrypt
const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, {expiresIn: "24h"} );
    return token;
}


// Middlewares:
const uploader = multer({
    storage,
    onError: (err, next) => {
        console.log(err),
        next();
    }
});

// Custom passport
const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if(err) return next(err);
            if(!user) {
                return res.status(401).send({error: info.messages ? info.messages : info.toString()});
            }
            req.user = user;
            next();
        }) (req, res, next);
    }
}

const parseToNumber = (req, res, next) => {
    if(typeof req.body.price === "string"){
        req.body.price === Number(req.body.price);
    }
    if(typeof req.body.stock === "string"){
        req.body.stock === Number(req.body.stock);
    }
    next();
}

const authorization = (role) => {
    return async (req, res, next) => {
        if(req.user.role != role) return res.status(403).send({error: 'Not permissions'});
        next();
    }
}

// const privateAccess = (req, res, next) => {
//     if(!req.session.user) return res.redirect("/login");
//     next();
// }

// const publicAccess = (req, res, next) => {
//     if(req.session?.user) return res.redirect("/products");
//     next();
// }

export {
    __dirname,
    uploader,
    parseToNumber,
    // privateAccess,
    // publicAccess,
    createHash,
    isValidPassword, 
    passportCall,
    authorization, 
    generateToken
};