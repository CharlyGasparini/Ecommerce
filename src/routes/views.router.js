import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/views.controllers.js";

export default class ViewsRouter extends Router {
    init() {
        this.get("/", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.redirectLogin)

        this.get("/products", ["USER", "ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.renderProducts)
        
        this.get("/carts/:cid", ["USER", "ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.renderCart)
        
        this.get("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.renderLogin)
        
        this.get("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.renderRegister)
        
        this.get("/reset", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.renderReset)
        
        this.get("/changePassword", ["PASS"], passportStrategiesEnum.JWT, controllerModule.renderChangePassword)

        this.get("/chat", ["USER", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.renderChat)
        
        this.get("/tickets", ["USER", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.renderTickets)

        this.get("/users", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.renderUsers);
    }
}