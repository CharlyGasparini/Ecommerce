const getLogs = async (req, res) => {
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toString()}`);
    req.logger.fatal("Prueba: log fatal");
    req.logger.error("Prueba: log error");
    req.logger.warning("Prueba log warning");
    req.logger.info("Prueba log info");
    req.logger.http("Prueba log http");
    req.logger.debug("Prueba log debug");
    res.sendSuccess("Logs generados");
}

export {
    getLogs
}