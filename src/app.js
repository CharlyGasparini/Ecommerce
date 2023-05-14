import express from "express";
import { Server } from "socket.io";
import handlbars from "express-handlebars";
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import dbProductManager from "./dao/dbManagers/dbProductManager.js";
import mongoose from "mongoose";

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
    const manager = new dbProductManager();
    try {
        const products = await manager.getProducts();
        socket.emit("showProducts", products); // Envia los productos al socket del cliente
        // Recibe el producto recopilado del form y lo agrega al array de productos
        socket.on("post", async data => {
            const product = data;
            await manager.addProduct(product);
        })
        // Recibe el id del producto y lo elimina del array de productos
        socket.on("delete", async data => {
            const pid = data;
            await manager.deleteProduct(pid);
        })
    } catch (error) {
        console.log(error);
    }
})

app.use(express.json()); // Soporte para .json
app.use(express.urlencoded({ extended: true })); // Soporte para params varios en las rutas
app.use(express.static(`${__dirname}/public`)); // Acceso a archivos estáticos

// Configuración de handlebars
app.engine("handlebars", handlbars.engine()); // Inicializa el motor
app.set("views", `${__dirname}/views`); // Ruta de la vistas
app.set("view engine", "handlebars"); // Que motor se debe usar para renderizar

// Routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.set('socketio', io);
