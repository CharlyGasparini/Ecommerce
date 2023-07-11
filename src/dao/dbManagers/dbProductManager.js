import productsModel from "../models/products.model.js";

export default class dbProductManager {
    constructor () {
        console.log("Working products with DB");
    }

    getAll = async () => {
        const products = await productsModel.find();
        return products;
    }

    create = async (product) => {
        const result = await productsModel.create(product);
        return result;
    }

    getById = async (pid) => {
        const result = await productsModel.findById(pid).lean();
        return result;
    }

    update = async (pid, product) => {
        const result = await productsModel.findByIdAndUpdate(pid, product);
        return result;
    }

    delete = async (pid) => {
        const result = await productsModel.updateOne({_id: pid}, {$set: {status: false}}); // Borrado lógico: modifico el valor del parametro status
        return result;
    }
}