import { Router } from "express";
import dbUserManager from "../dao/dbManagers/dbUserManager.js";
import passport from "passport";

const router = Router();
const manager = new dbUserManager();

router.post("/login", passport.authenticate("login", {failureRedirect: "fail-login"}), async (req, res) => {    
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
        role: req.user.role
    }

    res.send({status: "success", message: "Login exitoso, bienvenido"});
})

router.get('/fail-login', async (req, res) => {
    res.send({ status: 'error', message: 'Login fallido' });
});

router.get("/logout", (req, res) => {
    req.session.destroy( err => {
        if(err) res.status(500).send({status: "error", message: "Sesión finalizada"});
        res.redirect("/login");
    })
})

router.post("/register", passport.authenticate("register", {failureRedirect: "fail-register"}), async (req, res) => {
    res.send({status: "success", message: "Registro exitoso"});
})

router.get('/fail-register', async (req, res) => {
    res.send({ status: 'error', message: 'Registro fallido' });
});

export default router;