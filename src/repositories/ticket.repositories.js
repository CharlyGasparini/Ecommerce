
export default class ticketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getByPurchaser = async (purchaser) => {
        const result = await this.dao.getByPurchaser(purchaser);
        return result;
    }

    createTicket = async (ticket) => {
        const result = await this.dao.create(ticket);
        return result;
    }
}