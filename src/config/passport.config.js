import passport from "passport";
import local from "passport-local";
import dbUserManager from "../dao/dbManagers/dbUserManager.js";

const manager = new dbUserManager();
const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        req.body.password = password;
        try {
            const user = await manager.getUser(username);

            if(user) return done(null, false);

            const result = await manager.createUser(req.body);
            return done(null, result);
        } catch (error) {
            return done(`Error al obtener el usuario: ${error}`);
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (username, password, done) => {
        try {
            const result = await manager.validateUser(username, password);
            
            if(!result) return done(null, false);
            
            return done(null, result);
        } catch (error) {
            return done(`Error al obtener el usuario: ${error}`);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await manager.getUser(id);
        done(null, user);
    })
}

export default initializePassport;
