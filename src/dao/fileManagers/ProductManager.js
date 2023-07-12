import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
    constructor(path) {
        this.path = path;
        console.log("Working products with Files");
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
        products.push(product);
        product._id = uuidv4();
        const result = await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return result;
    }

    getById = async (pid) => {
        const products = await this.getAll();
        const product = products.find(prod => prod.id === pid);
        return product;
    }

    update = async (pid, product) => {
        const products = await this.getAll();
        const productIndex = products.findIndex(prod => prod.id === pid);
        const productToModify = products[productIndex];
        const modifiedProduct = Object.assign(productToModify, product);
        products.splice(productIndex, 1, modifiedProduct);
        const result = await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return result;
    }

    delete = async (pid) => {
        const products = await this.getAll();
        const productIndex = products.findIndex(prod => prod.id === pid);
        products[productIndex].status = false;
        const result = await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return result;
    }
}
