import { Router } from "express";
import dbCartManager from "../dao/dbManagers/dbCartManager.js";

const router = Router();
const manager = new dbCartManager();

router.post("/", async (req, res) => {
    const cart = req.body; // Traigo el carrito a agregar desde el body
    try {
        const result = await manager.addCart(cart); // Agrego el carrito
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid; // Traigo el id del carrito desde los parametros del path
    try {
        const cart = await manager.getCartById(cid); // Busco el carrito
        res.send({status: "success", payload: cart});
    } catch (error) {
        res.status(500).send({status: "error", error});    
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    // Traigo los id del carrito y del producto de los parametros del path
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const result = await manager.addProductInCart(cid, pid); // Agrego el producto al carrito
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});   
    }
})

export default router;