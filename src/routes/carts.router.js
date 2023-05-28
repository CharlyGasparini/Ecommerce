import { Router } from "express";
import dbCartManager from "../dao/dbManagers/dbCartManager.js";

const router = Router();
const manager = new dbCartManager();
// Agrega un carrito a la colección
router.post("/", async (req, res) => {
    const cart = req.body; // Traigo el carrito a agregar desde el body
    try {
        const result = await manager.addCart(cart); // Agrego el carrito
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})
// Busca un carrito por su ID
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid; // Traigo el id del carrito desde los parametros del path
    try {
        const cart = await manager.getCartById(cid); // Busco el carrito
        res.send({status: "success", payload: cart});
    } catch (error) {
        res.status(500).send({status: "error", error});    
    }
})
// Agrega un producto a un carrito
router.post("/:cid/products/:pid", async (req, res) => {
    // Traigo los id del carrito y del producto de los parametros del path
    const {pid, cid} = req.params;
    try {
        const result = await manager.addProductInCart(cid, pid); // Agrego el producto al carrito
        res.redirect("/carts/646b6b2e019903b533c9eae5");
        // res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});   
    }
})
// Elimina un producto a un carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const {pid, cid} = req.params;
    try {
        const result = await manager.deleteProductInCart(cid, pid);
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})
// Agrega un arreglo de productos a un carrito
router.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    try {
        const result = await manager.fillCart(cid, products);
        res.send({status: "success", payload: result})
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})
// Agrega una cantidad determinada de ejemplares de un producto a un carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const {pid, cid} = req.params;
    const quantity = req.body.quantity;
    try {
        const result = await manager.setQuantityOfProduct(cid, pid, quantity)
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})
// Vacia el carrito
router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        await manager.emptyCart(cid);
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

export default router;