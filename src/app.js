import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from "cors";

const app = express(); // Creación de server HTTP
const httpServer = app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
const io = new Server(httpServer); // Creación de server Websockets
const sessionsRouter = new SessionsRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();
const viewsRouter = new ViewsRouter();

// Handshake entre servidor y socket del cliente
io.on("connection", async socket => {
    console.log("Nuevo cliente conectado");
    try {
        const messagesModule = await import("./services/messages.service.js");

        socket.on("message", async data => {
            await messagesModule.saveMessage(data);
            io.emit("messageLogs", await messagesModule.getMessages());
        });

        socket.on("authenticated", async data => {
            const messages = await messagesModule.getMessages();
            socket.emit("messageLogs", messages);
            socket.broadcast.emit("newUserConnected", data);
        })
    } catch (error) {
        console.log(error);
    }
})

app.set("socketio", io);
app.use(express.json()); // Soporte para .json
app.use(express.urlencoded({ extended: true })); // Soporte para params varios en las rutas
app.use(express.static(`${__dirname}/public`)); // Acceso a archivos estáticos
app.use(cookieParser());
app.use(cors());

// Passport
initializePassport();
app.use(passport.initialize());

// Configuración de handlebars
app.engine("handlebars", handlebars.engine()); // Inicializa el motor
app.set("views", `${__dirname}/views`); // Ruta de la vistas
app.set("view engine", "handlebars"); // Que motor se debe usar para renderizar

// Routes
app.use("/", viewsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/sessions", sessionsRouter.getRouter());

