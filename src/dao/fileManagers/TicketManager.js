import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "../../utils/logger.js";

export default class dbTicketManager {
    constructor (path) {
        this.path = path;
        logger.info("Working tickets with Files");
    }

    #getAll = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8");
            const tickets = JSON.parse(data);
            return tickets;
        } else {
            return [];
        }
    }

    create = async (ticket) => {
        const tickets = await this.#getAll();
        ticket._id = uuidv4();
        tickets.push(ticket);
        await fs.promises.writeFile(this.path, JSON.stringify(tickets, null, "\t"));
        return ticket;
    }
}