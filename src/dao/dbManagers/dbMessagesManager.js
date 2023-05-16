import messageModel from "../models/message.model.js";

export default class dbMessageManager {
    constructor () {
        console.log("Working messages with DB");
    }

    getMessages = async () => {
        const messages = await messageModel.find().lean();
        return messages;
    }

    addMessage = async (message) => {
        const result = await messageModel.create(message);
        return result;
    }
}