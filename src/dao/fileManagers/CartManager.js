import fs from "fs";

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getAll() {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            return carts;
        } else {
            return [];
        }
    }
    
    getById = async (cid) => {
        const carts = await this.getAll();
        const cart = carts.find(cart => cart._id === cid);
        return cart;
    }

    add = async (cart) => {
        const carts = await this.getAll();

        if(carts.length === 0){
            cart._id = 1;
        } else {
            cart.id = carts[carts.length - 1]._id + 1;
        }

        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return true;
    }

    addOne = async (cid,pid) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        const productIndex = carts[cartIndex].products.findIndex(object => object.product._id === pid);
        
        if(productIndex === -1) {
            carts[cartIndex].products.push({product:{_id:pid}, quantity: 1})
        } else {
            carts[cartIndex].products[productIndex].quantity++;
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return true;
    }

    deleteOne = async (cid, pid) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        const productIndex = carts[cartIndex].products.findIndex(object => object.product._id === pid);
        carts[cartIndex].products.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return true;
    }

    addMany = async (cid, products) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        cart[cartIndex].products = products;
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return true;
    }

    updateQuantityOne = async (cid, pid, quantity) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        const productIndex = carts[cartIndex].products.findIndex(object => object.product._id === pid);
        carts[cartIndex].products[productIndex].quantity = quantity;
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return true;
    } 

    deleteAll = async (cid) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        carts[cartIndex].products = [];
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return true;
    }
}