import * as serviceModule from "../services/carts.service.js";

const addCart = async (req, res) => {
    try {
        const cart = req.body; // Traigo el carrito a agregar desde el body
        const result = await serviceModule.addCart(cart); // Agrego el carrito
        res.sendUser(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid; // Traigo el id del carrito desde los parametros del path
        const cart = await serviceModule.getCartById(cid); // Busco el carrito
        res.sendSuccess(cart);
    } catch (error) {
        res.sendServerError(error.message);   
    }
}

const addProductInCart = async (req, res) => {
    try {
        const {pid, cid} = req.params; // Traigo los id del carrito y del producto de los parametros del path
        const result = await serviceModule.addProductInCart(cid, pid); // Agrego el producto al carrito
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message); 
    }
}

const deleteProductInCart = async (req, res) => {
    try {
        const {pid, cid} = req.params;
        const result = await serviceModule.deleteProductInCart(cid, pid);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const fillCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const products = req.body;
        const result = await manager.fillCart(cid, products);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const setQuantityOfProduct = async (req, res) => {
    try {
        const {pid, cid} = req.params;
        const quantity = req.body.quantity;
        const result = await manager.setQuantityOfProduct(cid, pid, quantity)
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const emptyCart = async (req, res) =>{
    try {
        const cid = req.params.cid;
        const result = await manager.emptyCart(cid);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    addCart,
    getCartById,
    addProductInCart,
    deleteProductInCart,
    fillCart,
    setQuantityOfProduct,
    emptyCart
}