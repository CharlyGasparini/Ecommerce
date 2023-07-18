import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default class MessageManager {
    constructor (path) {
        this.path = path;
        console.log("Working messages with Files");
    }

    getAll = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8");
            const messages = JSON.parse(data);
            return messages;
        } else {
            return [];
        }
    }

    save = async (message) => {
        const messages = await this.getAll();
        message._id = uuidv4();
        messages.push(message);
        await fs.promises.writeFile(this.path, JSON.stringify(messages, null, "\t"));
        return message;
    }
}