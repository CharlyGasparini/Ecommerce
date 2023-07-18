import { messagesRepository } from "../repositories/index.js";

const getMessages = async () => {
    const result = await messagesRepository.getMessages();
    return result;
}

const saveMessage = async (message) => {
    const result = await messagesRepository.saveMessage(message);
    return result;
}

export {
    getMessages,
    saveMessage
}
