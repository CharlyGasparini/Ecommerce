import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import dbUserManager from "../dao/dbManagers/dbUserManager.js";

const manager = new dbUserManager();
const LocalStrategy = local.Strategy;

const initializePassport = () => {
    // registro con estrategia local
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        req.body.password = password;
        try {
            const user = await manager.getUser(username);

            if(user) return done(null, false, {messages: "Usuario no encontrado"});

            const result = await manager.createUser(req.body);
            return done(null, result);
        } catch (error) {
            return done(`Error al obtener el usuario: ${error}`);
        }
    }));
    // login con estrategia local
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (username, password, done) => {
        try {
            const result = await manager.validateUser(username, password);
            
            if(!result) return done(null, false, {messages: "Usuario no válido"});
            
            return done(null, result);
        } catch (error) {
            return done(`Error al obtener el usuario: ${error}`);
        }
    }));
    // registro/login con estrategia github
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.cd735444c94379d6",
        clientSecret: "32496b7687db27d5fdd6ab6b0d71b601d4a520d3",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const user = await manager.getUser(email);
            if(!user){
                const newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: "",
                    email,
                    age: 18,
                    password: ""
                }
                const result = await manager.createUser(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            done(`Error al registar el usuario: ${error}`);
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
