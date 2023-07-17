import * as usersServiceModule from "../services/users.service.js";
import config from "../config/config.js";
import { generateToken } from "../utils.js";
import { createHash, isValidPassword } from "../utils.js";
import UserDto from "../dao/DTOs/user.dto.js";

const login = async (req, res) => {    
    try {
        const {email, password} = req.body;
        
        if(email === config.adminName && password === config.adminPassword){
            // Generación del token
            const accessToken = generateToken({
                first_name: "Coder",
                last_name: "House",
                email,
                role: "admin"
            })

            return res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).send({status: "success", message: "Login exitoso, bienvenido"});
        }

        const user = await usersServiceModule.getUser(email);
        
        if(!user) return res.sendClientError("Credenciales incorrectas");
        
        const comparePassword = isValidPassword(user, password);
        
        if(!comparePassword) {
            return res.sendClientError("Credenciales incorrectas");
        }
        
        const accessToken = generateToken(user);
        res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).send({status: "success", message: "Login exitoso, bienvenido"});
    } catch (error) {
        res.sendServerError(error);
    }
}

const logout = (req, res) => {
    res.clearCookie("cookieToken").redirect("/login");
}

const register = async (req, res) => {
    try {
        const { first_name, last_name, age, email, password} = req.body;

        if(!first_name || !last_name || !age || !email || !password)
            return res.sendClientError("Valores incompletos");
        
        req.body.age = Number(req.body.age);
        const userExist = await usersServiceModule.getUser(email);

        if(userExist) return res.sendClientError("Ya existe un usuario registrado con el email");
        
        const result = await usersServiceModule.createUser(req.body);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error);
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
        if(!email || !password) return res.sendClientError("No puede haber campos vacios");

        const user = await usersServiceModule.getUser(email);

        if(!user) return res.sendClientError("El usuario no existe");

        user.password = createHash(password);

        const result = await usersServiceModule.updateUser(email, user);

        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error);
    }
}

const getCurrentUser = (req, res) => {
    const result = new UserDto(req.user);
    res.sendSuccess(result);
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