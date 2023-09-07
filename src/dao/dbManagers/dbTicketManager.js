import { logger } from "../../utils/logger.js";
import ticketsModel from "../models/tickets.model.js";

export default class dbTicketManager {
    constructor () {
        logger.info("Working tickets with DB");
    }

    getByPurchaser = async (purchaser) => {
        const result = await ticketsModel.find({purchaser}).lean();
        return result.reverse();
    }

    create = async (ticket) => {
        const result = await ticketsModel.create(ticket);
        return result;
    }
}