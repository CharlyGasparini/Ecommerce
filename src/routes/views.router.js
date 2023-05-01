import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    res.render("index", {
        title: "Planilla de productos",
        products: await new ProductManager("./src/files/products.json").getProducts()
    });
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        title: "Planilla de productos (tiempo real)"
    })
})

export default router;