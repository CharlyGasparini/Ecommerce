import { Router } from "express";
import dbProductManager from "../dao/dbManagers/dbProductManager.js";
import dbCartManager from "../dao/dbManagers/dbCartManager.js";
import { privateAccess, publicAccess } from "../utils.js";

const router = Router();
const productManager = await new dbProductManager();
const cartManager = await new dbCartManager();

// router.get("/", async (req, res) => {
//     res.render("index", {
//         title: "Planilla de productos",
//         products: await productManager.getProducts()
//     });
// });

// router.get("/realtimeproducts", (req, res) => {
//     res.render("realTimeProducts", {
//         title: "Planilla de productos (tiempo real)"
//     })
// })

// router.get("/chat", (req, res) => {
//     res.render("chat", {
//         title: "Chat"
//     })
// })

router.get("/", async (req, res) => {
    if(res.session?.user) return res.redirect("/products")
    res.redirect("/login");
})

router.get("/products", privateAccess, async (req, res) => {
    const {query="{}", limit= 10, page= 1, sort="{}"} = req.query;
    try {
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
            user: req.session.user
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            message: error
        })
    }
})

router.get("/carts/:cid", privateAccess, async (req, res) => {
    const cid = req.params.cid;
    let products = [];
    let total = 0;
    try {
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
            user: req.session.user
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            message: error
        })
    }
})

router.get("/login", publicAccess, (req, res) => {
    res.render("login", {title: "Formulario de login"});
})

router.get("/register", publicAccess, (req, res) => {
    res.render("register", {title: "Formulario de registro"})
})

router.get("/reset", (req, res) => {
    res.render("reset", {title: "Formulario de recuperación de clave"})
})


export default router;