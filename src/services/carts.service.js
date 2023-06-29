import { CARTSDAO } from "../dao/index.js";

const getCarts = async () => {
    const carts = await CARTSDAO.getAll();
    return carts;
}

const getCartById = async (cid) => {
    const result = await CARTSDAO.getById(cid);
    return result;
}

const addCart = async (cart) => {
    const result = await CARTSDAO.add(cart);
    return result;
}

const addProductInCart = async (cid, pid) => {
    const result = await CARTSDAO.addOne(cid, pid);
    return result;
}

const deleteProductInCart = async (cid, pid) => {
    const result = await CARTSDAO.deleteOne(cid, pid);
    return result;
}

const fillCart = async (cid, products) => {
    const result = await CARTSDAO.addMany(cid, products);
    return result;
}

const setQuantityOfProduct = async (cid, pid, quantity) => {
    const result = await CARTSDAO.updateQuantityOne(cid, pid, quantity);
    return result;
}

const emptyCart = async (cid) => {
    const result = await CARTSDAO.deleteAll(cid);
    return result;
}

export {
    getCarts,
    getCartById,
    addCart,
    addProductInCart,
    deleteProductInCart,
    fillCart,
    setQuantityOfProduct,
    emptyCart
}
