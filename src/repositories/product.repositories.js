
export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    getProductById = async (cid) => {
        const result = await this.dao.getById(cid);
        return result;
    }

    createProduct = async (product) => {
        const result = await this.dao.create(product);
        return result;
    }

    updateProduct = async (pid, product) => {
        const result = await this.dao.update(pid, product);
        return result;
    }

    deleteProduct = async (pid) => {
        const result = await this.dao.delete(pid);
        return result;
    }
}