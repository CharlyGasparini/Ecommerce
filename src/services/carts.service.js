import { cartsRepository } from "../repositories/index.js";

const getCarts = async () => {
    const carts = await cartsRepository.getCarts();
    return carts;
}

const getCartById = async (cid) => {
    const result = await cartsRepository.getCartById(cid);
    return result;
}

const createCart = async (cart) => {
    const result = await cartsRepository.createCart(cart);
    return result;
}

const addOneProductInCart = async (cid, pid) => {
    const result = await cartsRepository.addOneProductInCart(cid, pid);
    return result;
}

const deleteProductInCart = async (cid, pid) => {
    const result = await cartsRepository.deleteProductInCart(cid, pid);
    return result;
}

const addManyProductsInCart = async (cid, products) => {
    const result = await cartsRepository.addManyProductsInCart(cid, products);
    return result;
}

const updateProductQuantity = async (cid, pid, quantity) => {
    const result = await cartsRepository.updateProductQuantity(cid, pid, quantity);
    return result;
}

const emptyCart = async (cid) => {
    const result = await cartsRepository.emptyCart(cid);
    return result;
}

export {
    getCarts,
    getCartById,
    createCart,
    addOneProductInCart,
    deleteProductInCart,
    addManyProductsInCart,
    updateProductQuantity,
    emptyCart
}
