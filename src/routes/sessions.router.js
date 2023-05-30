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
        return res.send({status: "success", message: "Login successfull"})
    }
    
    try {
        const validate = await manager.validateUser(email, password);
        
        if(!validate.status){
            res.status(400).send({status: "error", message: validate.payload});
        }
        
        req.session.user = {
            name: `${validate.payload.first_name} ${validate.payload.last_name}`,
            email: validate.payload.email,
            age: validate.payload.age,
            role: validate.payload.role
        }
    
        res.send({status: "success", message: "Login successfull"});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy( err => {
        if(err) res.status(400).send({status: "error", message: "Logout fail"});
        res.redirect("/login");
    })
})

router.post("/register", async (req, res) => {
    const {email} = req.body;
    try {
        if(email === "adminCoder@coder.com"){
            return res.status(400).send({status: "error", message: "User is admin"});
        }
        
        const exist = await manager.getUser(email);
        
        if(exist) res.status(400).send({status: "error", message: "User already exists"});

        await manager.createUser(req.body);
        res.send({status: "success", message: "User registered"});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

export default router;