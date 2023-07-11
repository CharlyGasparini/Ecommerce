import { productsRepository } from "../repositories/index.js";

const getProducts = async () => {
    const products = await productsRepository.getProducts();
    return products;
}

const getProductById = async (pid) => {
    const result = await productsRepository.getProductById();
    return result;
}

const createProduct = async (product) => {
    const result = await productsRepository.createProduct(product);
    return result;
}

const updateProduct = async (pid, product) => {
    const result = await productsRepository.updateProduct(pid, product);
    return result;
}

const deleteProduct = async (pid) => {
    const result = await productsRepository.deleteProduct(pid);
    return result;
}

export{
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}