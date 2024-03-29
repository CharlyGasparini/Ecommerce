import { logger } from "../../utils/logger.js";
import productsModel from "../models/products.model.js";

export default class dbProductManager {
    constructor () {
        logger.info("Working products with DB");
    }

    getAll = async () => {
        const products = await productsModel.find().lean();
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
        const result = await productsModel.deleteOne({_id: pid});
        return result;
    }
}