import * as usersServiceModule from "../services/users.service.js";
import UserDto from "../dao/DTOs/user.dto.js";
import { IncompleteValues, NotInactiveUsers, UserNotFound } from "../utils/custom-exceptions.js";

const getAllUsers = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const users = await usersServiceModule.getAllUsers();
        const usersDto = users.map(user => {
            const userDto = new UserDto(user);
            delete userDto.cart;
            return userDto;
        })
        res.sendSuccess(usersDto);
    } catch (error) {
        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error);
    }
}

const changeRole = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const email = req.body.email
        const user = await usersServiceModule.getUser(email);

        if(!user) {
            throw new UserNotFound("El usuario no coincide");
        }

        const newToken = await usersServiceModule.changeRole(user);
        
        if(req.user.role === "admin"){
            return res.sendSuccess("rol modificado");    
        }

        res.cookie("authToken", newToken, { maxAge: 60*60*1000, httpOnly: true}).redirect("/products");
    } catch (error) {
        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error.message);
    }
}

const updateLastActivity = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const {user, time} = req.body

        if(!user || !time)
            throw new IncompleteValues("Valores incompletos. No puede haber datos sin completar");

        const result = await usersServiceModule.updateLastActivity(req.body);
        res.sendSuccess(result);

    } catch (error) {
        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const email = req.body.email;
        const result = await usersServiceModule.deleteUser(email);
        res.sendSuccess(result);
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

        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error.message);
    }
}

const deleteInactiveUsers48hs = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const result = await usersServiceModule.deleteInactiveUsers48hs();
        res.sendSuccess(result);
    } catch (error) {
        if(error instanceof NotInactiveUsers){
            req.logger.error(`${error.name}: ${error.message} - ${new Date().toString()}`);
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        };

        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error.message);
    }
}

export {
    getAllUsers,
    changeRole,
    updateLastActivity,
    deleteUser,
    deleteInactiveUsers48hs
}
