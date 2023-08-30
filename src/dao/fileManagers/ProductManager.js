import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
    constructor(path) {
        this.path = path;
        logger.info("Working products with Files");
    }

    getAll = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(data);
            return products;
        } else {
            return [];
        }
    }

    create = async (product) => {
        const products = await this.getAll();
        product._id = uuidv4();
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return product;
    }

    getById = async (pid) => {
        const products = await this.getAll();
        const product = products.find(prod => prod._id === pid);
        return product;
    }

    update = async (pid, product) => {
        const products = await this.getAll();
        const productIndex = products.findIndex(prod => prod._id === pid);
        const productToModify = products[productIndex];
        const modifiedProduct = Object.assign(productToModify, product);
        products.splice(productIndex, 1, modifiedProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return modifiedProduct;
    }

    delete = async (pid) => {
        const products = await this.getAll();
        const productIndex = products.findIndex(prod => prod.id === pid);
        products.splice(productIndex,1);
        const result = await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return result;
    }
}
