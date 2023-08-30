import * as serviceModule from "../services/products.service.js";
import { ProductNotFound, IncompleteValues, NotOwnProduct } from "../utils/custom-exceptions.js";
import { generateProducts } from "../utils/utils.js";

const getProducts = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const products = await serviceModule.getProducts(); // Traigo el array de productos
        res.sendSuccess(products);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const getProductById = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const pid = req.params.pid; // Traigo el id del producto desde los parametros del path
        const product = await serviceModule.getProductById(pid); // Busco el producto con el id correspondiente
        res.sendSuccess(product);
    } catch (error) {
        if(error instanceof ProductNotFound){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            );
        }
        res.sendServerError(error.message);
    }
}

const createProduct = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const product = req.body;
        const {title, description, price, code, stock, category} = product; // Traigo el producto a agregar desde el body

        if(!title || !description || !price || !code || !stock || !category){
            throw new IncompleteValues("Valores incompletos. No puede haber datos sin completar");
        }

        if(req.files){
            product.thumbnails = req.files.map(file => file.path); // Si hay thumbnails los agrego al producto
        }

        product.owner = req.user.role === "admin" ? "admin" : req.user.email;
        product.status = true;

        const result = await serviceModule.createProduct(product); // Agrego el producto
        res.sendSuccess(result);
    } catch (error) {
        if(error instanceof IncompleteValues){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        }

        res.sendServerError(error.message);
    }
}

const updateProduct = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const pid = req.params.pid; // Traigo el id del producto de los parametros del path
        const product = req.body; // Traigo los parametros a modificar desde el body
        const {title, description, price, code, stock, category} = product;
        if(!title, !description, !price, !code, !stock, !category){
            throw new IncompleteValues("Valores incompletos. No puede haber datos sin completar");
        }
        const result = await serviceModule.updateProduct(pid, product); // Modifico el producto
        res.sendSuccess(result);
    } catch (error) {
        if(error instanceof IncompleteValues){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        }
        
        res.sendServerError(error.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        const pid = req.params.pid; // Traigo el id del producto de los parametros del path
        const result = await serviceModule.deleteProduct(pid, req.user); // Borro el producto
        res.sendSuccess(result);
    } catch (error) {
        if(error instanceof NotOwnProduct){
            return res.sendClientError(
                {
                    ...error,
                    message: error.message
                }
            )
        };

        res.sendServerError(error.message);
    }
}

const getMockingProducts = async (req, res) => {
    try {
        req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProducts());
        }
        res.sendSuccess(products);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMockingProducts
}