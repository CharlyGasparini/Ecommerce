import { Router } from "express";
import passport from "passport";
import { authorization, createHash, passportCall, isValidPassword } from "../utils.js";
import userModel from "../dao/models/users.models.js";
import dbUserManager from "../dao/dbManagers/dbUserManager.js";
import { generateToken } from "../utils.js";

const router = Router();
const manager = new dbUserManager();

router.post("/login", async (req, res) => {    
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

        if(!user) return res.status(400).send({status: "error", message: "Credenciales incorrectas"});
        
        const comparePassword = isValidPassword(user, password);

        if(!comparePassword) {
            return res.status(400).send({status: "error", message: "Credenciales incorrectas"});
        }

        const accessToken = generateToken(user);
        res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).send({status: "success", message: "Login exitoso, bienvenido"});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/logout", passportCall("jwt"), (req, res) => {
    res.clearCookie("cookieToken").redirect("/login");
})

router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, age, email, password} = req.body;

        if(!first_name || !last_name || !age || !email || !password)
            return res.send(400).status({status: "error", message: "Valores incompletos"})

        const user = await manager.getUser(email);

        if(user) return res.status(400).status({status: "error", message: "El usuario ya existe"});

        const result = await manager.createUser(req.body);

        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {
    res.send({status: "success", message: "Usuario registrado"});
})

router.get("/github-callback", passport.authenticate("github", {failureRedirect: "/login", session: false}), authorization("user"), async (req, res) => {
    const accessToken = generateToken(req.user);
    res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).redirect("/products");
})

router.post("/reset", async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) return res.status(400).send({status: "error", message: "No puede haber campos vacios"});

        const user = await manager.getUser(email);

        if(!user) return res.status(400).send({status: "error", message: "El usuario no existe"});

        user.password = createHash(password);

        await userModel.updateOne({email}, user);

        res.send({status: "success", message: "Modificación exitosa"});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/current", passportCall("jwt"), async (req, res) => {
    res.send({status: "success", payload: req.user});
})

export default router;