import { Router } from "express";
import dbUserManager from "../dao/dbManagers/dbUserManager.js";

const router = Router();
const manager = new dbUserManager();

router.post("/login", async (req, res) => {    
    const {email, password} = req.body;

    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.user = {
            name: "CoderHouse",
            email,
            role: "admin"
        }
        return res.send({status: "success", message: "Login exitoso, bienvenido"})
    }
    
    try {
        const validate = await manager.validateUser(email, password);
        
        if(!validate.status){
            return res.status(400).send({status: "error", message: validate.payload});
        }
        
        req.session.user = {
            name: `${validate.payload.first_name} ${validate.payload.last_name}`,
            email: validate.payload.email,
            age: validate.payload.age,
            role: validate.payload.role
        }
    
        res.send({status: "success", message: "Login exitoso, bienvenido"});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy( err => {
        if(err) res.status(400).send({status: "error", message: "Sesión finalizada"});
        res.redirect("/login");
    })
})

router.post("/register", async (req, res) => {
    const {email} = req.body;
    try {
        if(email === "adminCoder@coder.com"){
            return res.status(400).send({status: "error", message: "El usuario es admin"});
        }
        
        const exist = await manager.getUser(email);
        
        if(exist){
            return res.status(400).send({status: "error", message: "El usuario ya existe"});
        } 
            
        await manager.createUser(req.body);
        res.send({status: "success", message: "Registro exitoso"});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

export default router;