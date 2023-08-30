import winston from "winston";
import config from "../config/config.js";

const environment = config.environment;

let logger;

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "magenta",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "white",
        debug: "blue"
    }
}

if(environment === "development") {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: customLevelOptions.colors
                    }),
                    winston.format.simple()
                )
            })
        ]
    })
} else {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: customLevelOptions.colors
                    }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: "src/logs/errors.log",
                level: "error"
            })
        ]
    })
}

const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
}

export {
    logger,
    addLogger
}