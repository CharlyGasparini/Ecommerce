import * as usersServiceModule from "../services/users.service.js";
import * as cartsServiceModule from "../services/carts.service.js";
import config from "../config/config.js";
import { generateToken } from "../utils.js";
import { createHash, isValidPassword } from "../utils.js";
import UserDto from "../dao/user.dto.js";

const login = async (req, res) => {    
    try {
        const {email, password} = req.body;
        
        if(email === config.adminName && password === config.adminPassword){
            // Verificación de existencia del carrito del admin
            const carts = await cartsServiceModule.getCarts();
            const adminCart = carts.find(cart => cart.admin === true);
            let cid;

            if(adminCart) {
                cid = adminCart._id
            }
            // Generación del token
            const accessToken = generateToken({
                first_name: "Coder",
                last_name: "House",
                email,
                cart: adminCart ? cid : (await cartsServiceModule.createCart({admin: true}))._id,
                role: "admin"
            })

            return res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).send({status: "success", message: "Login exitoso, bienvenido"});
        }

        const user = await usersServiceModule.getUser(email);

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
}

const logout = (req, res) => {
    res.clearCookie("cookieToken").redirect("/login");
}

const register = async (req, res) => {
    try {
        const { first_name, last_name, age, email, password} = req.body;

        if(!first_name || !last_name || !age || !email || !password)
            return res.send(400).status({status: "error", message: "Valores incompletos"})

        const user = await usersServiceModule.getUser(email);

        if(user) return res.status(400).status({status: "error", message: "El usuario ya existe"});

        const result = await usersServiceModule.createUser(req.body);

        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
}

const githubLogin = (req, res) => {
    res.send({status: "success", message: "Usuario registrado"});
}

const githubLoginCallback = (req, res) => {
    const accessToken = generateToken(req.user);
    res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).redirect("/products");
}

const resetPassword = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) return res.status(400).send({status: "error", message: "No puede haber campos vacios"});

        const user = await usersServiceModule.getUser(email);

        if(!user) return res.status(400).send({status: "error", message: "El usuario no existe"});

        user.password = createHash(password);

        await usersServiceModule.updateUser(email, user);

        res.send({status: "success", message: "Modificación exitosa"});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
}

const getCurrentUser = (req, res) => {
    const result = new UserDto(req.user);
    res.send({status: "success", payload: result});
}

export {
    login,
    logout,
    register,
    githubLogin,
    githubLoginCallback,
    resetPassword,
    getCurrentUser
}