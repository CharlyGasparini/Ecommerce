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
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

        if(error instanceof IncorrectCredentials){
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
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
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

        if(error instanceof IncompleteValues){
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        }

        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error.message);
    }
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

        const userDto = new UserDto(user);

        // Envio de mail
        await transporter.sendMail({
            from: "coderHouse 39760",
            to: email,
            subject: "Restaurar contraseña",
            html: `<div class="col"><h1>Enlace de restauración de contraseña</h1><a href="http://localhost:${config.port}/changePassword">Para restaurar su contraseña ingrese aqui</a></div>`
        })
        
        userDto.role = "pass";
        const accessToken = generateToken(userDto);
        res.cookie("authToken", accessToken, { maxAge: 60*60*1000, httpOnly: true}).sendSuccess("Email enviado");
    } catch (error) {
        if(error instanceof IncompleteValues){
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        }

        if(error instanceof UserNotFound){
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }

        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
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
        const user = await usersServiceModule.getUser(req.user.email);
        
        if(isValidPassword(user, newPassword)){
            throw new SamePassword("El password ingresado es el mismo que el ya existente");
        }

        user.role = "user";
        user.password = createHash(newPassword);

        await usersServiceModule.updateUser(user.email, user);
        res.clearCookie("passToken").sendSuccess("Contraseña restaurada");
    } catch (error) {
        if(error instanceof SamePassword){
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        };

        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error.message);
    }
}

export {
    login,
    logout,
    register,
    resetPassword,
    getCurrentUser,
    changePassword
}