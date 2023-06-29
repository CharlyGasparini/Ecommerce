import { PRODUCTSDAO } from "../dao/index.js";

const getProducts = async (query, limit, page, sort) => {
    const products = await PRODUCTSDAO.getAll(query, limit, page, sort);
    return products;
}

const addProduct = async (product) => {
    const result = await PRODUCTSDAO.add(product);
    return result;
}

const getProductById = async (pid) => {
    const result = await PRODUCTSDAO.getById(pid);
    return result;
}

const updateProduct = async (pid, product) => {
    const result = await PRODUCTSDAO.update(pid, product);
    return result;
}

const deleteProduct = async (pid) => {
    const result = await PRODUCTSDAO.delete(pid);
    return result;
}

export{
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}