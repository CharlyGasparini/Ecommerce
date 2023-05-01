import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { uploader } from "../utils.js/";

const router = Router();
const productManager = new ProductManager("./src/files/products.json");

router.get("/", async (req, res) => {
    let products = await productManager.getProducts(); // Traigo el array de productos
    const { limit } = req.query;
    if(limit){
        products = products.slice(0,Number(limit)); // Si se pasó un límite por query params se modifica el array obtenido
    }
    res.send({status: "success", products});
})

router.get("/:pid", async (req, res) => {
    const pid = Number(req.params.pid); // Traigo el id del producto desde los parametros del path
    const product = await productManager.getProductById(pid); // Busco el producto con el id correspondiente
    if(!product){
        res.status(404).send({status:"error", message: "Error: No se ha encontrado el producto"});
    } else {
        res.send({status: "success", product})
    }
})

router.post("/", uploader.array("files"), async (req, res) => {
    const product = req.body; // Traigo el producto a agregar desde el body
    if(req.files){
        product.thumbnails = req.files.map(file => file.path); // Si hay thumbnails los agrego al producto
    }
    const result = await productManager.addProduct(product); // Agrego el producto
    if(result === true){
        res.send({status: "success", message: "El producto ha sido agregado correctamente"});
    } else {
        res.status(404).send({status: "error", message: result});
    }
})

router.put("/:pid", async (req, res) => {
    const pid = Number(req.params.pid); // Traigo el id del producto de los parametros del path
    const modification = req.body; // Traigo los parametros a modificar desde el body
    const result = await productManager.updateProduct(pid, modification); // Modifico el producto
    if(result === true){
        res.send({status: "success", message: "El producto ha sido modificado correctamente"});
    } else {
        res.status(404).send({status: "error", message: result});
    }
})

router.delete("/:pid", async (req, res) => {
    const pid = Number(req.params.pid); // Traigo el id del producto de los parametros del path
    const result = await productManager.deleteProduct(pid); // Borro el producto
    if(result === true){
        res.send({status: "success", message: "El producto ha sido borrado correctamente"});
    } else {
        res.status(404).send({status: "error", message: result});
    }
})

export default router;