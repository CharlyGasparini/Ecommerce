import { fileURLToPath } from "url";
import { dirname } from "path";

// Convención nomenclatura: para temas de paths __nombre
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export {
    __dirname
};