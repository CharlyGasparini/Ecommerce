
export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAllUsers = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    getUser = async (email) => {
        const result = await this.dao.get(email);
        return result;
    }

    createUser = async (user) => {
        const result = await this.dao.create(user);
        return result;
    }

    updateUser = async (email, newUser) => {
        const result = await this.dao.update(email, newUser);
        return result;
    }

    deleteUser = async (email) => {
        const result = await this.dao.delete(email);
        return result;
    }
}