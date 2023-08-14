import Router from "./router.js";
import { uploader, parseToNumber } from "../utils/utils.js";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/products.controllers.js";

export default class ProductsRouter extends Router {
    init() {
        // Devuelve un mock de 100 productos generados aleatoriamente
        this.get("/mockingproducts", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.getMockingProducts)
        // Devuelve los productos en la DB
        this.get("/", ["USER", "ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.getProducts)
        // Devuelve un producto de la DB que corresponda al id brindado
        this.get("/:pid", ["USER", "ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.getProductById)
        // Agrega un producto a la DB
        this.post("/", ["ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, parseToNumber, uploader.array("files"), controllerModule.createProduct)
        // Modifica un producto en la DB
        this.put("/:pid", ["ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.updateProduct)
        // Modifica el status de un producto de la DB para que ya no se muestre (borrado lógico)
        this.delete("/:pid", ["ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.deleteProduct)
    }
}