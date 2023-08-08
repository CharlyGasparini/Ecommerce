import Router from "./router.js";
import { passportStrategiesEnum } from "../config/enums.js";
import * as controllerModule from "../controllers/sessions.controllers.js";
import { parseToNumber } from "../utils/utils.js";

export default class SessionsRouter extends Router{
    init() {
        // Lógica de login
        this.post("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.login)
        // Lógica de logout
        this.get("/logout", ["USER", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.logout)
        // Lógica de registro
        this.post("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, parseToNumber, controllerModule.register)
        // Lógica de github strategy
        this.get("/github", ["PUBLIC"], passportStrategiesEnum.GITHUB, controllerModule.githubLogin)
        // Lógica de github strategy / callback
        this.get("/github-callback", ["USER"], passportStrategiesEnum.GITHUB, controllerModule.githubLoginCallback)
        // Lógica de inicio de reseteo de clave
        this.post("/reset", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.resetPassword)
        // Lógica de final de reseteo de clave
        this.post("/changePassword", ["PASS"], passportStrategiesEnum.JWT, controllerModule.changePassword)
        // Lógica que retorna contenido del token
        this.get("/current", ["USER", "ADMIN"], passportStrategiesEnum.JWT, controllerModule.getCurrentUser)
    }
}