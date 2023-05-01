import express from "express";
import { Server } from "socket.io";
import handlbars from "express-handlebars";
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

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