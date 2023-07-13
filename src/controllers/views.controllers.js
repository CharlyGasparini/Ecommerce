import * as productsServiceModule from "../services/products.service.js";
import * as cartsServiceModule from "../services/carts.service.js";
import UserDto from "../dao/user.dto.js";

const redirectLogin = (req, res) => {
    if(req.cookies["cookieToken"]) return res.redirect("/products")
    res.redirect("/login");
}

const renderProducts = async (req, res) => {
    try {
        const products = await productsServiceModule.getProducts();
        res.render("products", {
            products,
            user: new UserDto(req.user),
            isUser: req.user.role === "user" ? true : false
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
        console.log(result)
        // del resultado obtenido mapeo un array nuevo con los datos que necesito mostrar
        if(result.products.length > 0){
            products = result.products.map(item => {
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

const renderChat = (req, res) => {
    res.render("chat", {title: "Chat"})
}

export {
    redirectLogin,
    renderProducts,
    renderCart,
    renderLogin,
    renderRegister,
    renderReset,
    renderChat
}