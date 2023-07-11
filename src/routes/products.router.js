import Router from "./router.js";
import { uploader, parseToNumber } from "../utils.js/";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/products.controllers.js";

export default class ProductsRouter extends Router {
    init() {
        // Devuelve los productos en la DB
        this.get("/", ["USER", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.getProducts)
        // Devuelve un producto de la DB que corresponda al id brindado
        this.get("/:pid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.getProductById)
        // Agrega un producto a la DB
        this.post("/", ["ADMIN"], passportStrategiesEnum.JWT, parseToNumber, uploader.array("files"), controllerModule.addProduct)
        // Modifica un producto en la DB
        this.put("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.updateProduct)
        // Modifica el status de un producto de la DB para que ya no se muestre (borrado lógico)
        this.delete("/:pid", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.deleteProduct)
    }
}