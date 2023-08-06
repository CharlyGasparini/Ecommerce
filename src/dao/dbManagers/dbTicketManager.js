import { logger } from "../../utils/logger.js";
import ticketsModel from "../models/tickets.model.js";

export default class dbTicketManager {
    constructor () {
        logger.info("Working tickets with DB");
    }

    create = async (ticket) => {
        const result = await ticketsModel.create(ticket);
        return result;
    }
}