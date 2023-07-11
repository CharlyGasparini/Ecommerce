import express from "express";
// import "./dao/dbManagers/dbConfig.js"; // Conexión a base de datos con mongoose
// import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import SessionsRouter from "./routes/sessions.router.js";
// import dbProductManager from "./dao/dbManagers/dbProductManager.js";
// import dbMessageManager from "./dao/dbManagers/dbMessagesManager.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from "cors";

const app = express(); // Creación de server HTTP
app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
// const io = new Server(httpServer); // Creación de server Websockets
const sessionsRouter = new SessionsRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();
const viewsRouter = new ViewsRouter();

// Handshake entre servidor y socket del cliente
// io.on("connection", async socket => {
//     console.log("Nuevo cliente conectado");
//     const productManager = new dbProductManager();
//     const messageManager = new dbMessageManager();
//     try {
//         socket.emit("showProducts", await productManager.getProducts()); // Envia los productos al socket del cliente
//         // Recibe el producto recopilado del form y lo agrega al array de productos
//         socket.on("post", async data => {
//             const product = data;
//             await productManager.addProduct(product);
//             socket.emit("showProducts", await productManager.getProducts());
//         })
//         // Recibe el id del producto y lo elimina del array de productos
//         socket.on("delete", async data => {
//             const pid = data;
//             await productManager.deleteProduct(pid);
//             socket.emit("showProducts", await productManager.getProducts());
//         })

//         socket.on("message", async data => {
//             await messageManager.addMessage(data);
//             io.emit("messageLogs", await messageManager.getMessages());
//         });

//         socket.on("authenticated", async data => {
//             const messages = await messageManager.getMessages();
//             socket.emit("messageLogs", messages);
//             socket.broadcast.emit("newUserConnected", data);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })

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

