import * as productsServiceModule from "../services/products.service.js";
import * as cartsServiceModule from "../services/carts.service.js";

const redirectLogin = (req, res) => {
    if(req.cookies["cookieToken"]) return res.redirect("/products")
    res.redirect("/login");
}

const renderProducts = async (req, res) => {
    try {
        const {query="{}", limit= 10, page= 1, sort="{}"} = req.query;
        const result = await productsServiceModule.getProducts(query, Number(limit), page, sort);
        const {docs:payload, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage} = result;
        let urlParams = "?";
        if(query) urlParams += `query=${query}&`;
        if(limit) urlParams += `limit=${limit}&`;
        if(sort) urlParams += `sort=${sort}&`;
        const prevLink = hasPrevPage ? `${urlParams}page=${prevPage}` : null;
        const nextLink = hasNextPage ? `${urlParams}page=${nextPage}` : null;
        res.render("products", {
            payload,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            user: req.user
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            message: error
        })
    }
}

const renderCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        let products = [];
        let total = 0;
        const result = await cartsServiceModule.getCartById(cid);
        // del resultado obtenido mapeo un array nuevo con los datos que necesito mostrar
        if(result[0].products.length > 0){
            products = result[0].products.map(item => {
                const result = {};
                result._id = item.product._id;
                result.title = item.product.title;
                result.quantity = item.quantity;
                result.price = item.product.price;
                result.status = item.product.status;
                result.subtotal = (result.quantity * result.price).toFixed(2);
                return result;
            })
            total = products.map(prod => Number(prod.subtotal)).reduce((acc, curr) => acc + curr).toFixed(2);
        }
        res.render("carts", {
            title: "Carrito de compras",
            cid,
            products,
            total,
            isFull: products.length > 0 ? true : false,
            user: req.user
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            message: error
        })
    }
}

const renderLogin = (req, res) => {
    res.render("login", {title: "Formulario de login"});
}

const renderRegister = (req, res) => {
    res.render("register", {title: "Formulario de registro"})
}

const renderReset = (req, res) => {
    res.render("reset", {title: "Formulario de recuperación de clave"})
}

export {
    redirectLogin,
    renderProducts,
    renderCart,
    renderLogin,
    renderRegister,
    renderReset
}