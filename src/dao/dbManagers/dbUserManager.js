import { logger } from "../../utils/logger.js";
import userModel from "../models/users.models.js";

export default class dbUserManager {
    constructor() {
        logger.info("Working users with DB");
    }

    get = async (email) => {
        const user = await userModel.findOne({email});
        return user;
    }

    create = async (user) => {
        const result = await userModel.create(user);
        return result;
    }

    update = async (email, newUser) => {
        const result = await userModel.updateOne({email}, newUser);
        return result;
    }
}