
export default class ticketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createTicket = async (ticket) => {
        const result = await this.dao.create(ticket);
        return result;
    }
}