import productsModel from "../models/products.model.js";

export default class dbProductManager {
    constructor () {
        console.log("Working products with DB");
    }

    getProducts = async (query, limit, page, sort) => {

        const products = await productsModel.paginate(JSON.parse(query), {limit, page, lean: true, sort: JSON.parse(sort)});
        return products;
    }

    addProduct = async (product) => {
        const result = await productsModel.create(product);
        return result;
    }

    getProductById = async (pid) => {
        const result = await productsModel.find({_id: pid});
        return result;
    }

    updateProduct = async (pid, product) => {
        const result = await productsModel.updateOne({_id: pid}, product);
        return result;
    }

    deleteProduct = async (pid) => {
        const result = await productsModel.updateOne({_id: pid}, {$set: {status: false}}); // Borrado lógico: modifico el valor del parametro status
        return result;
    }
}