import * as productsServiceModule from "../services/products.service.js";
import * as cartsServiceModule from "../services/carts.service.js";
import * as usersServiceModule from "../services/users.service.js";
import UserDto from "../dao/DTOs/user.dto.js";
import { ticketsRepository } from "../repositories/index.js";

const redirectLogin = (req, res) => {
    if(req.cookies["authToken"]) return res.redirect("/products");
    res.redirect("/login");
}

const renderProducts = async (req, res) => {
    try {
        const products = await productsServiceModule.getProducts();
        res.render("products", {
            title: "Productos en stock",
            products,
            user: new UserDto(req.user),
            isAdmin: req.user.role === "admin" ? true : false,
            isPremium: req.user.role === "premium" ? true : false
        })
    } catch (error) {
        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
        res.render("error", {
            title: "Error",
            message: error
        })
    }
}

const renderCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartsServiceModule.getCartById(cid);
        const products = cart.products.map(prod => {
            const subtotal = parseFloat((prod.product.price * prod.quantity).toFixed(2));
            return {
                _id: prod.product._id,
                title: prod.product.title,
                price: prod.product.price,
                quantity: prod.quantity,
                status: prod.product.status,
                subtotal
            }
        })
        const total = parseFloat(products.reduce((acc, prod) => {
            return acc + prod.subtotal;
        }, 0).toFixed(2));
        res.render("carts", {
            title: "Carrito de compras",
            cid,
            products,
            total,
            isFull: products.length > 0 ? true : false,
            user: new UserDto(req.user)
        })
    } catch (error) {
        req.logger.fatal(`${error.name}: ${error.message} - ${new Date().toString()}`);
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
    res.render("chat", {
        title: "Chat",
        user: new UserDto(req.user)
    })
}

const renderChangePassword = (req, res) => {
    res.render("changePassword", {
        title: "Restaurar contraseña",
    })
}

const renderTickets = async (req, res) => {
    const user = new UserDto(req.user);
    const tickets = await ticketsRepository.getByPurchaser(user.email);
    res.render("tickets", {
        title: "Historial de compras",
        user,
        tickets
    })
}

const renderUsers = async (req, res) => {
    const users = await usersServiceModule.getAllUsers();
    const usersDTO = users.map(user => {
        return new UserDto(user);
    });
    res.render("users", {
        title: "Listado de usuarios",
        user: new UserDto(req.user),
        users: usersDTO,
        isFull: users.length > 0 ? true : false,
    })
}

export {
    redirectLogin,
    renderProducts,
    renderCart,
    renderLogin,
    renderRegister,
    renderReset,
    renderChat,
    renderChangePassword,
    renderTickets,
    renderUsers
}