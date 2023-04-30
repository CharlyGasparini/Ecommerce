import express, { urlencoded } from "express";
import { Server } from "socket.io";
import handlbars from "express-handlebars";
import { __dirname } from "./utils.js";

const app = express(); // Creación de server HTTP
const httpServer = app.listen(8080, "Listening on port 8080");
const io = new Server(httpServer); // Creación de server Websockets

app.use(express.json()); // Soporte para .json
app.use(express.static(urlencoded({ extended: true })));
app.use(express.static(`${__dirname}/public`)); // Acceso a archivos estáticos

// Configuración de handlebars
app.engine("handlebars", handlbars.engine()); // Inicializa el motor
app.set("views", `${__dirname}/views`); // Ruta de la vistas
app.set("view engine", "handlebars"); // Que motor se debe usar para renderizar

