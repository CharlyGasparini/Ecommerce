import * as usersServiceModule from "../services/users.service.js";
import { generateToken, createHash, isValidPassword } from "../utils/utils.js";
import UserDto from "../dao/DTOs/user.dto.js";
import { UserNotFound, IncorrectCredentials, UserAlreadyExists, IncompleteValues, SamePassword } from "../utils/custom-exceptions.js";
import transporter from "../config/nodemailer.config.js";
import config from "../config/config.js";

const login = async (req, res) => {    
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const {email, password} = req.body;

        const accessToken = await usersServiceModule.login(email, password);
        
        return res.cookie("authToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).sendSuccess("Login exitoso, bienvenido");
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
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
    res.clearCookie("authToken").redirect("/login");
}

const register = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
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
    res.sendSuccess("Usuario registrado");
}

const githubLoginCallback = (req, res) => {
    const accessToken = generateToken(req.user);
    res.cookie("authToken", accessToken, { maxAge: 60*60*1000, httpOnly: true});
}

const resetPassword = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const email = req.body.email;
        
        if(!email) {
            throw new IncompleteValues("Valores incompletos. No puede haber datos sin completar");
        }

        const user = await usersServiceModule.getUser(email);

        if(!user) {
            throw new UserNotFound("El usuario no existe");
        }

        // Envio de mail
        await transporter.sendMail({
            from: "coderHouse 39760",
            to: email,
            subject: "Restaurar contraseña",
            html: `<div class="col"><h1>Enlace de restauración de contraseña</h1><a href="http://localhost:${config.port}/changePassword">Para restaurar su contraseña ingrese aqui</a></div>`
        })
        
        user.role = "pass";
        const accessToken = generateToken(user);
        res.cookie("passToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).sendSuccess("Email enviado");
    } catch (error) {
        if(error instanceof IncompleteValues){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        }

        if(error instanceof UserNotFound){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

        res.sendServerError(error.message);
    }
}

const getCurrentUser = (req, res) => {
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
    const result = new UserDto(req.user);
    res.sendSuccess(result);
}

const changePassword = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const newPassword = req.body.password;
        const user = req.user;
        
        if(isValidPassword(user, newPassword)){
            throw new SamePassword("El password ingresado es el mismo que el ya existente");
        }

        user.role = "user";
        user.password = createHash(newPassword);

        await usersServiceModule.updateUser(user.email, user);
        res.clearCookie("passToken").sendSuccess("Contraseña restaurada");
    } catch (error) {
        if(error instanceof SamePassword){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        };

        res.sendServerError(error.message);
    }
}

const changeRole = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const uid = req.params.uid;

        if(!req.user._id === uid) {
            throw new UserNotFound("El usuario no coincide");
        }

        const newToken = await usersServiceModule.changeRole(req.user);
        res.cookie("authToken", newToken, { maxAge: 60*60*1000, httpOnly: true}).redirect("/products");
    } catch (error) {
        if(error instanceof UserNotFound){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        };

        res.sendServerError(error.message);
    }
}

export {
    login,
    logout,
    register,
    githubLogin,
    githubLoginCallback,
    resetPassword,
    getCurrentUser,
    changePassword, 
    changeRole
}