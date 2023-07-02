import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path;
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

    add = async (product) => {
        const products = await this.getAll();
        products.status = true;

        if(products.length === 0){
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }
        
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return true;
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
        products.splice(productIndex, 1,modifiedProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return true;
    }

    delete = async (pid) => {
        const products = await this.getAll();
        const productIndex = products.findIndex(prod => prod.id === pid);
        products.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return true;
    }
}
