import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/carts.controllers.js";

export default class CartsRouter extends Router {
    init() {
        // Agrega un carrito a la DB
        this.post("/", ["USER", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.createCart)
        // Busca un carrito en la DB por su id
        this.get("/:cid", ["USER", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.getCartById)
        // Agrega un producto a un carrito
        this.post("/:cid/products/:pid", ["USER"], passportStrategiesEnum.JWT, controllerModule.addProductInCart)
        // Elimina un producto a un carrito
        this.delete("/:cid/products/:pid", ["USER"], passportStrategiesEnum.JWT, controllerModule.deleteProductInCart)
        // Agrega un arreglo de productos a un carrito
        this.put("/:cid", ["USER"], passportStrategiesEnum.JWT, controllerModule.addManyProductsInCart)
        // Agrega una cantidad determinada de ejemplares de un producto a un carrito
        this.put("/:cid/products/:pid", ["USER"], passportStrategiesEnum.JWT, controllerModule.updateProductQuantity)
        // Vacia el carrito
        this.delete("/:cid", ["USER"], passportStrategiesEnum.JWT, controllerModule.emptyCart)
    }
}