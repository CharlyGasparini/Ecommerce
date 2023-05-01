import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/files/carts.json");

router.post("/", async (req, res) => {
    const cart = req.body; // Traigo el carrito a agregar desde el body
    await cartManager.addCart(cart); // Agrego el carrito
    res.send({status: "success", message: "El carrito se agregó correctamente"});
})

router.get("/:cid", async (req, res) => {
    const cid = Number(req.params.cid); // Traigo el id del carrito desde los parametros del path
    const cart = await cartManager.getCartById(cid); // Busco el carrito
    if(!cart){
        res.status(404).send({status: "error", message: "Error, el carrito no existe"});
    } else {
        const products = cart.products; // Muestro los productos del carrito
        res.send({status: "success", products});
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = Number(req.params.cid); // Traigo los id del carrito y del producto de los parametros del path
    const pid = Number(req.params.pid);
    const result = await cartManager.addProductInCart(cid, pid); // Agrego el producto al carrito
    if(result === true){
        res.send({status: "success", message: "El producto se agregó correctamente al carrito"});
    } else {
        res.status(404).send({status: "error", message: result});
    }
})

export default router;