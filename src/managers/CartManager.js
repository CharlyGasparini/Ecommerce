import fs from "fs";
import ProductManager from "./ProductManager.js";

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            // Validación de existencia del archivo de productos
            if(fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, "utf-8"); // Si existe, leo el archivo
                const carts = JSON.parse(data); // Lo parseo a un array de objetos
                return carts; // Retorno el array de productos
            } else {
                return []; // Si no existe, retorno un array vacio
            }
        } catch (error) {   
            console.log(error);
        }
    }
    
    async getCartById(cid) {
        try {
            const carts = await this.getCarts(); // Traigo el array de carritos
            const cart = carts.find(cart => cart.id === cid); // Busco el carrito con el id que recibo por parámetro
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async addCart(cart) {
        try {
            const carts = await this.getCarts(); // Traigo el array de carritos
            // Genero el id autoincrementable
            if(carts.length === 0){
                cart.id = 1; // Si no existe ningun carrito en el archivo el id será 1
            } else {
                cart.id = carts[carts.length - 1].id + 1; // Si existen carritos en el array, busco el id del ultimo + 1
            }
            carts.push(cart); // Agrego el carrito al array
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t")); // Creo un nuevo archivo .json que contenga el nuevo array de carritos        
        } catch (error) {
            console.log(error);
        }
    }

    async addProductInCart(cid,pid) {
        try {
            const carts = await this.getCarts(); // Traigo el array de carritos
            const cartIndex = carts.findIndex(cart => cart.id === cid); // Busco el índice del carrito al que deseo agregar un producto
            const product = new ProductManager().getProductById(pid); // Busco el producto que se desea agregar
            if(cartIndex === -1){
                return console.log("Error: El carrito no existe");
            }
            if(!product){
                return console.log("Error: el producto que desea añadir no existe");
            }
            const cartToModify = carts[cartIndex]; // Obtengo el carrito a modificar
            const productInCart = cartToModify.products.find(object => object.product.id === pid); // Busco si el producto que quiero agregar ya existe en el carrito
            if(productInCart){
                productInCart.quantity++; // Si existe, incremento su cantidad en 1
            } else {
                cartToModify.products.push({product:{id:pid}, quantity: 1}); // Si no existe, lo agrego con cantidad 1
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t")); // Creo un nuevo archivo .json con el nuevo array de carritos
        } catch (error) {
            console.log(error);
        }
    }
}