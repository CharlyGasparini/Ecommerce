import * as serviceModule from "../services/products.service.js";

const getProducts = async (req, res) => {
    try {
        const {query="{}", limit=10, page=1, sort="{}"} = req.query;
        const products = await serviceModule.getProducts(query, Number(limit), page, sort); // Traigo el array de productos
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

const getProductById = async (req, res) => {
    try {
        const pid = req.params.pid; // Traigo el id del producto desde los parametros del path
        const product = await serviceModule.getProductById(pid); // Busco el producto con el id correspondiente
        res.sendSuccess(product);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const addProduct = async (req, res) => {
    try {
        const product = req.body;
        const {title, description, price, code, stock, category} = product; // Traigo el producto a agregar desde el body
        if(!title || !description || !price || !code || !stock || !category){
            return res.sendUserError("Valores incompletos");
        }
        if(req.files){
            product.thumbnails = req.files.map(file => file.path); // Si hay thumbnails los agrego al producto
        }
        const result = await serviceModule.addProduct(product); // Agrego el producto
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid; // Traigo el id del producto de los parametros del path
        const product = req.body; // Traigo los parametros a modificar desde el body
        const {title, description, price, code, stock, category} = product;
        if(!title, !description, !price, !code, !stock, !category){
            return res.status(400).send({status: "error", error: "Incomplete values"});
        }
        const result = await serviceModule.updateProduct(pid, product); // Modifico el producto
        res.send({status: "success", payload: result})
    } catch (error) {
        res.status(500).send({status: "error", error});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid; // Traigo el id del producto de los parametros del path
        const result = await serviceModule.deleteProduct(pid); // Borro el producto
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}