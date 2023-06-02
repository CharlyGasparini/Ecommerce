import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import dbProductManager from "./dao/dbManagers/dbProductManager.js";
import mongoose from "mongoose";
import dbMessageManager from "./dao/dbManagers/dbMessagesManager.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/sessions.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

const app = express(); // Creación de server HTTP
const httpServer = app.listen(8080, () => console.log("Listening on port 8080"));
const io = new Server(httpServer); // Creación de server Websockets
// Conexión a base de datos con mongoose
try {
    await mongoose.connect("mongodb+srv://crgasparini32:GSNltCfSNvAcw1xd@cluster39760cg.jgxfm1z.mongodb.net/ecommerce?retryWrites=true&w=majority")
} catch (error) {
    console.log(error);
}
// Handshake entre servidor y socket del cliente
io.on("connection", async socket => {
    console.log("Nuevo cliente conectado");
    const productManager = new dbProductManager();
    const messageManager = new dbMessageManager();
    try {
        socket.emit("showProducts", await productManager.getProducts()); // Envia los productos al socket del cliente
        // Recibe el producto recopilado del form y lo agrega al array de productos
        socket.on("post", async data => {
            const product = data;
            await productManager.addProduct(product);
            socket.emit("showProducts", await productManager.getProducts());
        })
        // Recibe el id del producto y lo elimina del array de productos
        socket.on("delete", async data => {
            const pid = data;
            await productManager.deleteProduct(pid);
            socket.emit("showProducts", await productManager.getProducts());
        })

        socket.on("message", async data => {
            await messageManager.addMessage(data);
            io.emit("messageLogs", await messageManager.getMessages());
        });

        socket.on("authenticated", async data => {
            const messages = await messageManager.getMessages();
            socket.emit("messageLogs", messages);
            socket.broadcast.emit("newUserConnected", data);
        })
    } catch (error) {
        console.log(error);
    }
})
// Configuración de sesiones con persistencia de datos en DB
app.use(session({
    store: MongoStore.create(
        {
            client: mongoose.connection.getClient(),
            ttl: 1800
        }
    ),
    secret: "password",
    resave: true,
    saveUninitialized: false
}))
// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // Soporte para .json
app.use(express.urlencoded({ extended: true })); // Soporte para params varios en las rutas
app.use(express.static(`${__dirname}/public`)); // Acceso a archivos estáticos

// Configuración de handlebars
app.engine("handlebars", handlebars.engine()); // Inicializa el motor
app.set("views", `${__dirname}/views`); // Ruta de la vistas
app.set("view engine", "handlebars"); // Que motor se debe usar para renderizar

// Routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
