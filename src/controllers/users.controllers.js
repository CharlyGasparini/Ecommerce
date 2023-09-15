import * as usersServiceModule from "../services/users.service.js";
import UserDto from "../dao/DTOs/user.dto.js";

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

const deleteInactiveUsers = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        
    } catch (error) {
        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.sendServerError(error);       
    }
}

export {
    getAllUsers,
    deleteInactiveUsers
}
