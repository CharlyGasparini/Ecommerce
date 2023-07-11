
export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCarts = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    getCartById = async (cid) => {
        const result = await this.dao.getById(cid);
        return result;
    }

    createCart = async (cart) => {
        const result = await this.dao.create(cart);
        return result;
    }

    addOneProductInCart = async (cid, pid) => {
        const result = await this.dao.addOne(cid, pid);
        return result;
    }

    deleteProductInCart = async (cid, pid) => {
        const result = await this.dao.deleteOne(cid, pid);
        return result;
    }
    
    addManyProductsInCart = async (cid, products) => {
        const result = await this.dao.addMany(cid, products);
        return result;
    }

    updateProductQuantity = async (cid, pid, quantity) => {
        const result = await this.dao.updateQuantityOne(cid, pid, quantity);
        return result;
    }

    emptyCart = async (cid) => {
        const result = await this.dao.deleteAll(cid);
        return result;
    }
}