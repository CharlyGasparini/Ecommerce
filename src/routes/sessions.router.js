import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/sessions.controllers.js";
import { parseToNumber } from "../utils/utils.js";

export default class SessionsRouter extends Router{
    init() {
        // Lógica de github strategy
        this.get("/github", ["PUBLIC"], passportStrategiesEnum.GITHUB, controllerModule.githubLogin)
        // Lógica de login
        this.post("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.login)
        // Lógica de github strategy / callback
        this.get("/github-callback", ["USER", "PREMIUM"], passportStrategiesEnum.GITHUB, controllerModule.githubLoginCallback)
        // Lógica de logout
        this.get("/logout", ["USER", "ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.logout)
        // Lógica que retorna contenido del token
        this.get("/current", ["USER", "ADMIN", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.getCurrentUser)
        // Lógica de cambio de rol del usuario
        this.get("/premium/:uid", ["USER", "PREMIUM"], passportStrategiesEnum.JWT, controllerModule.changeRole)
        // Lógica de registro
        this.post("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, parseToNumber, controllerModule.register)
        // Lógica de inicio de reseteo de clave
        this.post("/reset", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.resetPassword)
        // Lógica de final de reseteo de clave
        this.post("/changePassword", ["PASS"], passportStrategiesEnum.JWT, controllerModule.changePassword)
        // Lógica de registro de la última actividad del usuario
        this.post("/activity", ["USER", "PREMIUM", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.updateLastActivity)
        // Lógica de borrado de usuarios sin actividad
        this.delete("/deleteInactive", ["ADMIN"], passportStrategiesEnum.JWT, controllerModule.deleteInactiveUsers48hs)
    }
}