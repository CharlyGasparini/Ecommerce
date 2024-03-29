import { logger } from "../../utils/logger.js";
import messageModel from "../models/message.model.js";

export default class dbMessageManager {
    constructor () {
        logger.info("Working messages with DB");
    }

    getAll = async () => {
        const messages = await messageModel.find().lean();
        return messages;
    }

    save = async (message) => {
        const result = await messageModel.create(message);
        return result;
    }
}