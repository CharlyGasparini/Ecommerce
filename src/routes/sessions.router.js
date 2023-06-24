import { createHash, generateToken, isValidPassword } from "../utils.js";
import userModel from "../dao/models/users.models.js";
import dbUserManager from "../dao/dbManagers/dbUserManager.js";
import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";

const manager = new dbUserManager();

export default class SessionsRouter extends Router {
    init() {
        // Lógica de login
        this.post("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, async (req, res) => {    
            try {
                const {email, password} = req.body;
                
                if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
                    const accessToken = generateToken({
                        first_name: "Coder",
                        last_name: "House",
                        email,
                        cart: "649363298362c08342b2e989",
                        role: "admin"
                    })
    
                    return res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).send({status: "success", message: "Login exitoso, bienvenido"});
                }
    
                const user = await manager.getUser(email);

                if(!user) return res.sendUserError("Credenciales incorrectas");
                
                const comparePassword = isValidPassword(user, password);

                if(!comparePassword) {
                    return res.sendUserError("Credenciales incorrectas");
                }
    
                const accessToken = generateToken(user);
                res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).send({status: "success", message: "Login exitoso, bienvenido"});
            } catch (error) {
                res.sendServerError(error.message);
            }
        })
        // Lógica de logout
        this.get("/logout", ["USER", "ADMIN"], passportStrategiesEnum.JWT ,(req, res) => {
            res.clearCookie("cookieToken");
        })
        // Lógica de registro
        this.post("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, async (req, res) => {
            try {
                const { first_name, last_name, age, email, password} = req.body;
    
                if(!first_name || !last_name || !age || !email || !password)
                    return res.sendUserError("Valores incompletos");
    
                const user = await manager.getUser(email);
    
                if(user) return res.sendUserError("El usuario ya existe");
    
                const result = await manager.createUser(req.body);
    
                res.sendSuccess(result);
            } catch (error) {
                res.sendServerError(error.message);
            }
        })
        // // revisar y adaptar al formato class Router
        // this.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {
        //     res.send({status: "success", message: "Usuario registrado"});
        // })
        // // revisar y adaptar al formato class Router
        // this.get("/github-callback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
        //     const accessToken = generateToken(req.user);
        //     res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).redirect("/products");
        // })
        // Lógica de reseteo de clave
        this.post("/reset", ["PUBLIC"], passportStrategiesEnum.NOTHING,async (req, res) => {
            try {
                const {email, password} = req.body;

                if(!email || !password) return res.sendUserError("Valores incompletos")
        
                const user = await manager.getUser(email);
        
                if(!user) return res.sendUserError("El usuario no existe");
        
                user.password = createHash(password);
        
                const result = await userModel.updateOne({email}, user);
        
                res.sendSuccess(result);
            } catch (error) {
                res.sendServerError(error.message);
            }
        })
        // Lógica que retorna contenido del token
        this.get('/current', ["USER", "ADMIN"], passportStrategiesEnum.JWT, (req, res) => {
            res.sendSuccess(req.user);
        });
    }
}