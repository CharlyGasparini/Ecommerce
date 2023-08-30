import nodemailer from "nodemailer";
import config from "./config.js";

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.nodemailerUser,
        pass: config.nodemailerPass // contraseña de aplicación
    }
})

export default transporter;