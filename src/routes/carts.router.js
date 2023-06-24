import Router from "./router.js";
import dbCartManager from "../dao/dbManagers/dbCartManager.js";
import { passportStrategiesEnum } from "../config/enums.js";

const manager = new dbCartManager();

export default class CartsRouter extends Router {
    init() {
        // Agrega un carrito a la DB
        this.post("/", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.addCart)
        // Busca un carrito en la DB por su id
        this.get("/:cid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.getCartById)
        // Agrega un producto a un carrito
        this.post("/:cid/products/:pid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.addProductInCart)
        // Elimina un producto a un carrito
        this.delete("/:cid/products/:pid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.deleteProductInCart)
        // Agrega un arreglo de productos a un carrito
        this.put("/:cid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.fillCart)
        // Agrega una cantidad determinada de ejemplares de un producto a un carrito
        this.put("/:cid/products/:pid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.setQuantityOfProduct)
        // Vacia el carrito
        this.delete("/:cid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.emptyCart)
    }

    async addCart(req, res) {
        try {
            const cart = req.body; // Traigo el carrito a agregar desde el body
            const result = await manager.addCart(cart); // Agrego el carrito
            res.sendUser(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    async getCartById(req, res) {
        try {
            const cid = req.params.cid; // Traigo el id del carrito desde los parametros del path
            const cart = await manager.getCartById(cid); // Busco el carrito
            res.sendSuccess(cart);
        } catch (error) {
            res.sendServerError(error.message);   
        }
    }

    async addProductInCart(req, res) {
        try {
            const {pid, cid} = req.params; // Traigo los id del carrito y del producto de los parametros del path
            const result = await manager.addProductInCart(cid, pid); // Agrego el producto al carrito
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message); 
        }
    }

    async deleteProductInCart(req, res) {
        try {
            const {pid, cid} = req.params;
            const result = await manager.deleteProductInCart(cid, pid);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    async fillCart(req, res) {
        try {
            const cid = req.params.cid;
            const products = req.body;
            const result = await manager.fillCart(cid, products);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    async setQuantityOfProduct(req, res) {
        try {
            const {pid, cid} = req.params;
            const quantity = req.body.quantity;
            const result = await manager.setQuantityOfProduct(cid, pid, quantity)
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    async emptyCart(req, res) {
        try {
            const cid = req.params.cid;
            const result = await manager.emptyCart(cid);
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }
}