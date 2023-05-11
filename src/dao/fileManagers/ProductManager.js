import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            // Validación de existencia del archivo de productos
            if(fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, "utf-8"); // Si existe, leo el archivo
                const products = JSON.parse(data); // Lo parseo a un array de objetos
                return products; // Retorno el array de productos
            } else {
                return []; // Si no existe, retorno un array vacio
            }
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            product.status = true; // Aplico parametro status valor true por defecto
            let { title, price, stock, description, category, code } = product; // Desestructuro el producto recibido por parámetro
            // Validación de los parámetros del producto
            if(!title || !price || !stock || !description || !category || !code){
                return "Error: Debe completar todos los campos obligatorios";
            }
            if(price <= 0){
                return "Error: El precio no puede ser menor a 1";
            }
            if(stock <= 0){
                return "Error: El stock no puede ser menor a 1";
            }
            // Conversión a number de stock y price
            if(typeof price === "string"){
                product.price = parseFloat(price);
            }
            if(typeof stock === "string"){
                product.stock = parseInt(stock);
            }
            // Validación del code
            const prodIndex = products.findIndex(prod => prod.code === code);
            if(prodIndex !== -1){
                return "Error: El código ingresado ya existe";
            }
            // Genero el id autoincrementable
            if(products.length === 0){
                product.id = 1; // Si no existe ningun producto en el archivo el id será 1
            } else {
                product.id = products[products.length - 1].id + 1; // Si existen productos busco el id del ultimo producto del array + 1
            }
            products.push(product); // Agrego al array de productos el nuevo producto
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t")); // Creo un nuevo archivo .json que contenga el nuevo array de productos modificado
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(pid) {
        try {
            const products = await this.getProducts(); // Traigo el array de productos
            const product = products.find(prod => prod.id === pid); // Busco el producto en el array de productos
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(pid, modification) {
        try {
            const products = await this.getProducts(); // Traigo el array de productos
            const productIndex = products.findIndex(prod => prod.id === pid); // Busco el índice del producto que deseo modificar
            console.log(productIndex)
            if(productIndex === -1){
                return "Error: El producto que desea modificar no existe";
            }
            const productToModify = products[productIndex]; // Si existe, lo traigo
            const modifiedProduct = Object.assign(productToModify, modification); // Creo el producto con las modificaciones
            products.splice(productIndex, 1,modifiedProduct); // Reemplazo el producto original por el modificado
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t")); // Creo un nuevo archivo .json con la modificación
            return true
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(pid) {
        try {
            const products = await this.getProducts(); // Traigo el array de productos
            const productIndex = products.findIndex(prod => prod.id === pid); // Busco el índice del producto que deseo modificar
            if(productIndex === -1){
                return "Error: El producto que desea eliminar no existe";
            }
            products.splice(productIndex, 1); // Si existe, lo elimino del arreglo
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t")); // Creo un nuevo archivo .json con la modificación
            return true;
        } catch (error) {
            console.log(error);
        }
    }
}
