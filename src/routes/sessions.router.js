import { Router } from "express";
import passport from "passport";
import { createHash, passportCall } from "../utils.js";
import userModel from "../dao/models/users.models.js";
import dbUserManager from "../dao/dbManagers/dbUserManager.js";

const router = Router();
const manager = new dbUserManager();

router.post("/login", passportCall("login"), passport.authenticate("login", {failureRedirect: "fail-login"}), async (req, res) => {    
    const {email, password} = req.body;

    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.user = {
            name: "CoderHouse",
            email,
            role: "admin"
        }
        return res.send({status: "success", message: "Login exitoso, bienvenido"})
    }
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role
    }

    res.cookie("cartId", `${req.user.cart}`, {httpOnly: true, signed: true}).send({status: "success", message: "Login exitoso, bienvenido"});
})

router.get('/fail-login', async (req, res) => {
    res.send({ status: 'error', message: 'Login fallido' });
});

router.get("/logout", (req, res) => {
    req.session.destroy( err => {
        if(err) res.status(500).send({status: "error", message: "Sesión finalizada"});
        res.clearCookie("cartId").redirect("/login");
    })
})

router.post("/register", passportCall("register"), passport.authenticate("register", {failureRedirect: "fail-register"}), async (req, res) => {
    res.send({status: "success", message: "Registro exitoso"});
})

router.get('/fail-register', async (req, res) => {
    res.send({ status: 'error', message: 'Registro fallido' });
});

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {
    res.send({status: "success", message: "Usuario registrado"});
})

router.get("/github-callback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role
    };
    
    res.cookie("cartId", `${req.user.cart}`, {httpOnly: true, signed: true}).redirect("/products");
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
        res.status(500).send({status: "error", message: error});
    }
})

router.get("/current", async (req, res) => {
    res.send({status: "success", payload: req.signedCookies});
})

export default router;