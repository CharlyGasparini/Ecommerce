import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/users.controllers.js";

export default class UsersRouter extends Router {
    init() {
        //Lógica de obtención de usuarios
        this.get("/", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.getAllUsers)
        // Lógica de eliminación de usuarios sin actividad
        this.delete("/", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.deleteInactiveUsers)
    }
}