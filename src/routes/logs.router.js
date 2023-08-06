import { passportStrategiesEnum } from "../config/enums.js";
import Router from "./router.js";
import * as controllerModule from "../controllers/logs.controllers.js";

export default class LogsRouter extends Router {
    init() {
        this.get("/loggerTest", ["PUBLIC"], passportStrategiesEnum.NOTHING, controllerModule.getLogs);
    }
}