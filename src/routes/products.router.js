import { Router } from "express";
import dbProductManager from "../dao/dbManagers/dbProductManager.js";
import { uploader, parseToNumber } from "../utils.js/";

const router = Router();
const manager = new dbProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await manager.getProducts(); // Traigo el array de productos
        const { limit } = req.query;
        if(limit){
            products = products.slice(0,Number(limit)); // Si se pasó un límite por query params se modifica el array obtenido
        }
        res.send({status: "success", payload: products});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/:pid", async (req, res) => {
    const pid = req.params.pid; // Traigo el id del producto desde los parametros del path
    try {
        const product = await manager.getProductById(pid); // Busco el producto con el id correspondiente
        res.send({status: "success", payload: product});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.post("/", parseToNumber, uploader.array("files"), async (req, res) => {
    const product = req.body;
    const {title, description, price, code, stock, category} = product; // Traigo el producto a agregar desde el body
    if(!title, !description, !price, !code, !stock, !category){
        return res.status(400).send({status: "error", error: "Incomplete values"});
    }
    if(req.files){
        product.thumbnails = req.files.map(file => file.path); // Si hay thumbnails los agrego al producto
    }
    try {
        const result = await manager.addProduct(product); // Agrego el producto
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid; // Traigo el id del producto de los parametros del path
    const product = req.body; // Traigo los parametros a modificar desde el body
    const {title, description, price, code, stock, category} = product;
    if(!title, !description, !price, !code, !stock, !category){
        return res.status(400).send({status: "error", error: "Incomplete values"});
    }
    try {
        const result = await manager.updateProduct(pid, product); // Modifico el producto
        res.send({status: "success", payload: result})
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid; // Traigo el id del producto de los parametros del path
    try {
        const result = await manager.deleteProduct(pid); // Borro el producto
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

export default router;