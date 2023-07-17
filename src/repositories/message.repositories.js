
export default class MessagesRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getMessages = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    createProduct = async (message) => {
        const result = await this.dao.create(message);
        return result;
    }
}