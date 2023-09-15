import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/users.controllers.js";

export default class UsersRouter extends Router {
    init() {
        //Lógica de obtención de usuarios
        this.get("/", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.getAllUsers)
        // Lógica de cambio de rol del usuario
        this.post("/premium", ["USER", "PREMIUM", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.changeRole)
        // Lógica de registro de la última actividad del usuario
        this.post("/activity", ["USER", "PREMIUM", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.updateLastActivity)
        // Lógica de borrado de usuarios
        this.delete("/delete", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.deleteUser)
        // Lógica de borrado de usuarios sin actividad
        this.delete("/deleteInactive", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.deleteInactiveUsers48hs)
    }
}