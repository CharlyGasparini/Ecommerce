import * as usersServiceModule from "../services/users.service.js";
import { generateToken, createHash } from "../utils/utils.js";
import UserDto from "../dao/DTOs/user.dto.js";
import { UserNotFound, IncorrectCredentials, UserAlreadyExists, IncompleteValues } from "../utils/custom-exceptions.js";

const login = async (req, res) => {    
    try {
        const {email, password} = req.body;

        const accessToken = await usersServiceModule.login(email, password);
        
        return res.cookie("cookieToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).send({status: "success", message: "Login exitoso, bienvenido"});
    } catch (error) {
        if(error instanceof UserNotFound){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

        if(error instanceof IncorrectCredentials){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

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
            throw new IncompleteValues("Valores incompletos. No puede haber datos sin completar");

        const result = await usersServiceModule.register(req.body);
        res.sendSuccess(result);
    } catch (error) {
        if(error instanceof UserAlreadyExists){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

        if(error instanceof IncompleteValues){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        }

        res.sendServerError(error.message);
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