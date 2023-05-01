import express from "express";
import { Server } from "socket.io";
import handlbars from "express-handlebars";
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express(); // Creación de server HTTP
const httpServer = app.listen(8080, () => console.log("Listening on port 8080"));
const io = new Server(httpServer); // Creación de server Websockets

app.use(express.json()); // Soporte para .json
app.use(express.urlencoded({ extended: true })); // Soporte para params varios en las rutas
app.use(express.static(`${__dirname}/public`)); // Acceso a archivos estáticos

// Configuración de handlebars
app.engine("handlebars", handlbars.engine()); // Inicializa el motor
app.set("views", `${__dirname}/views`); // Ruta de la vistas
app.set("view engine", "handlebars"); // Que motor se debe usar para renderizar

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Handshake entre servidor y socket del cliente
io.on("connection", async socket => {
    console.log("Nuevo cliente conectado");
    const productManager = new ProductManager("./src/files/products.json");

    socket.emit("showProducts", await productManager.getProducts()); // Envia los productos al socket del cliente
    // Recibe el producto recopilado del form y lo agrega al array de productos
    socket.on("post", async data => {
        await productManager.addProduct(data);
    })
    // Recibe el id del producto y lo elimina del array de productos
    socket.on("delete", async data => {
        const pid = Number(data);
        await productManager.deleteProduct(pid);
    })
})

app.set("socketio", io);