import * as usersServiceModule from "../services/users.service.js";
import UserDto from "../dao/DTOs/user.dto.js";
import { IncompleteValues, NotInactiveUsers } from "../utils/custom-exceptions.js";

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
    updateLastActivity,
    deleteInactiveUsers48hs
}
