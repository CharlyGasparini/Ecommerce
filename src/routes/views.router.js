import { Router } from "express";
import dbProductManager from "../dao/dbManagers/dbProductManager.js";
import dbCartManager from "../dao/dbManagers/dbCartManager.js";

const router = Router();
const productManager = await new dbProductManager();
const cartManager = await new dbCartManager();

router.get("/", async (req, res) => {
    res.render("index", {
        title: "Planilla de productos",
        products: await productManager.getProducts()
    });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {
        title: "Planilla de productos (tiempo real)"
    })
})

router.get("/chat", (req, res) => {
    res.render("chat", {
        title: "Chat"
    })
})

router.get("/products", async (req, res) => {
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
            nextLink
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            message: error
        })
    }
})

router.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const result = await cartManager.getCartById(cid);
        console.log(result[0].products)
        res.render("carts", {
            products: result[0].products,
            title: "Carrito de compras",
            cid,
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            message: error
        })
    }
})

export default router;