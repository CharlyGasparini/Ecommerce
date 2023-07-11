import dotenv from "dotenv";
import {Command} from "commander";

const program = new Command();

program
    .option(
        "--mode <mode>", 
        "Modo de trabajo", 
        "DEVELOPMENT")

program.parse();

const environment = program.opts().mode;
dotenv.config({
    path: environment == "DEVELOPMENT" ? "./.env.development" : "./.env.production"
});

export default {
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistance: process.env.PERSISTANCE
}