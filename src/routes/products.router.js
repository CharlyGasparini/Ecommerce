import Router from "./router.js";
import dbProductManager from "../dao/dbManagers/dbProductManager.js";
import { uploader, parseToNumber } from "../utils.js/";
import { passportStrategiesEnum } from "../config/enums.js";

const manager = new dbProductManager();

export default class ProductsRouter extends Router {
    init() {
        // Devuelve los productos en la DB
        this.get("/", ["ADMIN"], passportStrategiesEnum.JWT, this.getProducts)
        // Devuelve un producto de la DB que corresponda al id brindado
        this.get("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, this.getProductById)
        // Agrega un producto a la DB
        this.post("/", ["ADMIN"], passportStrategiesEnum.JWT, parseToNumber, uploader.array("files"), this.addProduct)
        // Modifica un producto en la DB
        this.put("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, this.updateProduct)
        // Modifica el status de un producto de la DB para que ya no se muestre (borrado lógico)
        this.delete("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, this.deleteProduct)
    }

    async getProducts(req, res) {
        try {
            const {query="{}", limit=10, page=1, sort="{}"} = req.query;
            const products = await manager.getProducts(query, Number(limit), page, sort); // Traigo el array de productos
            const {docs:payload, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage} = products;
            let urlParams = "?";

            if(query) urlParams += `query=${query}&`;
            if(limit) urlParams += `limit=${limit}&`;
            if(sort) urlParams += `sort=${sort}&`;

            const prevLink = hasPrevPage ? `${urlParams}page=${prevPage}` : null;
            const nextLink = hasNextPage ? `${urlParams}page=${nextPage}` : null;

            res.sendSuccess({
                payload,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            })
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    async getProductById(req, res) {
        try {
            const pid = req.params.pid; // Traigo el id del producto desde los parametros del path
            const product = await manager.getProductById(pid); // Busco el producto con el id correspondiente
            res.sendSuccess(product);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    async addProduct(req, res) {
        try {
            const product = req.body;
            const {title, description, price, code, stock, category} = product; // Traigo el producto a agregar desde el body
            if(!title || !description || !price || !code || !stock || !category){
                return res.sendUserError("Valores incompletos");
            }
            if(req.files){
                product.thumbnails = req.files.map(file => file.path); // Si hay thumbnails los agrego al producto
            }
            const result = await manager.addProduct(product); // Agrego el producto
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    async updateProduct(req, res) {
        try {
            const pid = req.params.pid; // Traigo el id del producto de los parametros del path
            const product = req.body; // Traigo los parametros a modificar desde el body
            const {title, description, price, code, stock, category} = product;
            if(!title, !description, !price, !code, !stock, !category){
                return res.status(400).send({status: "error", error: "Incomplete values"});
            }
            const result = await manager.updateProduct(pid, product); // Modifico el producto
            res.send({status: "success", payload: result})
        } catch (error) {
            res.status(500).send({status: "error", error});
        }
    }

    async deleteProduct(req, res) {
        try {
            const pid = req.params.pid; // Traigo el id del producto de los parametros del path
            const result = await manager.deleteProduct(pid); // Borro el producto
            res.sendSuccess(result);
        } catch (error) {
            res.sendServerError(error.message);
        }
    }
}