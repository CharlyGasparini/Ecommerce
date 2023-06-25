import { Router } from "express";
import dbProductManager from "../dao/dbManagers/dbProductManager.js";
import { uploader, parseToNumber } from "../utils.js/";
import { authorization, passportCall } from "../utils.js";

const router = Router();
const manager = new dbProductManager();

router.get("/", passportCall("jwt"), async (req, res) => {
    const {query="{}", limit=10, page=1, sort="{}"} = req.query;
    try {
        const {docs:payload, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage} = await manager.getProducts(query, Number(limit), page, sort); // Traigo el array de productos
        res.send({
            status: "success",
            payload,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: !hasPrevPage ? null : `/api/products?limit=${limit}&page=${prevPage}&query=${query}&sort=${sort}`,
            nextLink: !hasNextPage ? null : `/api/products?limit=${limit}&page=${nextPage}&query=${query}&sort=${sort}`
        })
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.get("/:pid", passportCall("jwt"), async (req, res) => {
    const pid = req.params.pid; // Traigo el id del producto desde los parametros del path
    try {
        const product = await manager.getProductById(pid); // Busco el producto con el id correspondiente
        res.send({status: "success", payload: product});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

router.post("/", passportCall("jwt"), parseToNumber, uploader.array("files"), async (req, res) => {
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

router.put("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {
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

router.delete("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {
    const pid = req.params.pid; // Traigo el id del producto de los parametros del path
    try {
        const result = await manager.deleteProduct(pid); // Borro el producto
        res.send({status: "success", payload: result});
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
})

export default router;