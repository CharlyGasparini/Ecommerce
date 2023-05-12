import { Router } from "express";
import dbProductManager from "../dao/dbManagers/dbProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    res.render("index", {
        title: "Planilla de productos",
        products: await new dbProductManager().getProducts(),
    });
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        title: "Planilla de productos (tiempo real)"
    })
})

export default router;