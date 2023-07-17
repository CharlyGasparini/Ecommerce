import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import ProductManager from "./ProductManager.js";


export default class CartManager {
    constructor(path) {
        this.path = path;
        console.log("Working carts with Files");
    }

    getAll = async () => {
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

    create = async (cart) => {
        const carts = await this.getAll();
        cart._id = uuidv4();
        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return cart;
    }

    addOne = async (cid, pid) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        const productIndex = carts[cartIndex].products.findIndex(object => object.product._id === pid);
        const productManager = new ProductManager("./src/files/products.json");
        const product = await productManager.getById(pid);
        if(productIndex === -1) {
            carts[cartIndex].products.push({product, quantity: 1})
        } else {
            carts[cartIndex].products[productIndex].quantity++;
        }

        const result = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return result;
    }

    deleteOne = async (cid, pid) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        const productIndex = carts[cartIndex].products.findIndex(object => object.product._id === pid);
        carts[cartIndex].products.splice(productIndex, 1);
        const result = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return result;
    }

    addMany = async (cid, products) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        carts[cartIndex].products = products;
        const result = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return result;
    }

    updateQuantityOne = async (cid, pid, quantity) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        const productIndex = carts[cartIndex].products.findIndex(object => object.product._id === pid);
        carts[cartIndex].products[productIndex].quantity = quantity;
        const result = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return result;
    } 

    deleteAll = async (cid) => {
        const carts = await this.getAll();
        const cartIndex = carts.findIndex(cart => cart._id === cid);
        carts[cartIndex].products = [];
        const result = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return result;
    }
}