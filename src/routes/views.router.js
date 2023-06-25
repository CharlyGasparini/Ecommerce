import dbProductManager from "../dao/dbManagers/dbProductManager.js";
import dbCartManager from "../dao/dbManagers/dbCartManager.js";
import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";

const productManager = await new dbProductManager();
const cartManager = await new dbCartManager();

export default class ViewsRouter extends Router {
    init() {
        this.get("/", ["PUBLIC"], passportStrategiesEnum.NOTHING, async (req, res) => {
            if(req.cookies["cookieToken"]) return res.redirect("/products")
            res.redirect("/login");
        })

        this.get("/products", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.renderProducts)
        
        this.get("/carts/:cid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, this.renderCart)
        
        this.get("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, (req, res) => {
            res.render("login", {title: "Formulario de login"});
        })
        
        this.get("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, (req, res) => {
            res.render("register", {title: "Formulario de registro"})
        })
        
        this.get("/reset", ["PUBLIC"], passportStrategiesEnum.NOTHING, (req, res) => {
            res.render("reset", {title: "Formulario de recuperación de clave"})
        })
    }

    async renderProducts(req, res) {
        try {
            const {query="{}", limit= 10, page= 1, sort="{}"} = req.query;
            const result = await productManager.getProducts(query, Number(limit), page, sort);
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

    async renderCart(req, res) {
        try {
            const cid = req.params.cid;
            let products = [];
            let total = 0;
            const result = await cartManager.getCartById(cid);
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
}