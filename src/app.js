import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __mainDirname } from "./utils/utils.js";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import LogsRouter from "./routes/logs.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from "cors";
import compression from "express-compression";
import { logger, addLogger } from "./utils/logger.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express(); // Creación de server HTTP
const httpServer = app.listen(config.port, () =>
  logger.info(`Listening on port ${config.port}`)
);
const io = new Server(httpServer); // Creación de server Websockets
const sessionsRouter = new SessionsRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();
const viewsRouter = new ViewsRouter();
const logsRouter = new LogsRouter();

// Handshake entre servidor y socket del cliente
io.on("connection", async (socket) => {
  logger.info("Nuevo cliente conectado");
  try {
    const messagesModule = await import("./services/messages.service.js");

    socket.on("message", async (data) => {
      await messagesModule.saveMessage(data);
      io.emit("messageLogs", await messagesModule.getMessages());
    });
    
    socket.on("authenticated", async (data) => {
      const messages = await messagesModule.getMessages();
      socket.emit("messageLogs", messages);
      socket.broadcast.emit("newUserConnected", data);
    });
  } catch (error) {
    logger.error(error.message);
  }
});

app.set("socketio", io);
app.use(express.json()); // Soporte para .json
app.use(express.urlencoded({ extended: true })); // Soporte para params varios en las rutas
app.use(express.static(`${__mainDirname}/public`)); // Acceso a archivos estáticos
app.use(cookieParser());
app.use(cors());
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
  ); // aplicacion de compresion con brotli
app.use(addLogger);

// Passport
initializePassport();
app.use(passport.initialize());

// Configuración de handlebars
app.engine("handlebars", handlebars.engine()); // Inicializa el motor
app.set("views", `${__mainDirname}/views`); // Ruta de la vistas
app.set("view engine", "handlebars"); // Que motor se debe usar para renderizar

// Configuración de swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación del proyecto de e-commerce para el curso de Backend de CoderHouse",
      description: "API pensada para resolver el proceso de compra de productos online"
    }
  }, 
  apis: [`${__mainDirname}/docs/**/*.yaml`]
};

// Routes
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/", viewsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/api/logs", logsRouter.getRouter());

