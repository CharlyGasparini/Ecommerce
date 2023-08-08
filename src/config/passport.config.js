import passport from "passport";
import jwt from 'passport-jwt';
import GitHubStrategy from "passport-github2";
import { PRIVATE_KEY } from "./constants.js";
import * as usersServicesModule from "../services/users.service.js";
import config from "../config/config.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    // Estrategia con jwt
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }))

    // registro/login con estrategia github
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.cd735444c94379d6",
        clientSecret: "32496b7687db27d5fdd6ab6b0d71b601d4a520d3",
        callbackURL: `http://localhost:${config.port}/api/sessions/github-callback`,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const user = await usersServicesModule.getUser(email);
            if(!user){
                const newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: "",
                    email,
                    age: 18,
                    password: ""
                }
                const result = await usersServicesModule.createUser(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            done(`Error al registar el usuario: ${error}`);
        }
    }))

}

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['authToken'];
    }
    return token;
}

export default initializePassport;
