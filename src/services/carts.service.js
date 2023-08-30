import transporter from "../config/nodemailer.config.js";
import { cartsRepository, productsRepository, ticketsRepository } from "../repositories/index.js";
import { v4 as uuidv4 } from 'uuid';
import { CartNotFound, SameOwner } from "../utils/custom-exceptions.js";

const getCarts = async () => {
    const carts = await cartsRepository.getCarts();
    return carts;
}

const getCartById = async (cid) => {
    const result = await cartsRepository.getCartById(cid);
    if(!result) {
        throw new CartNotFound("No se encontró el carrito");
    } 
    return result;
}

const createCart = async (cart) => {
    const result = await cartsRepository.createCart(cart);
    return result;
}

const addOneProductInCart = async (cid, pid, user) => {
    const product = await productsRepository.getProductById(pid);
    
    if(user.email === product.owner) {
        throw new SameOwner("No se puede agregar al carrito tus propios productos");
    }

    const result = await cartsRepository.addOneProductInCart(cid, pid);
    return result;
}

const deleteProductInCart = async (cid, pid) => {
    const result = await cartsRepository.deleteProductInCart(cid, pid);
    return result;
}

const addManyProductsInCart = async (cid, products, user) => {
    const product = products.findIndex(product => product.owner === user.email);
    
    if(product === -1) {
        throw new SameOwner("No se puede agregar al carrito tus propios productos");
    }
    
    const result = await cartsRepository.addManyProductsInCart(cid, products);
    return result;
}

const updateProductQuantity = async (cid, pid, quantity) => {
    const result = await cartsRepository.updateProductQuantity(cid, pid, quantity);
    return result;
}

const emptyCart = async (cid) => {
    const result = await cartsRepository.emptyCart(cid);
    return result;
}

const makePurchase = async (cid, purchaser) => {
    const cart = await cartsRepository.getCartById(cid);
    const cartProducts = cart.products;
    let amount = 0;
    const notEnoughStock = [];
    const enoughStock = [];

    cartProducts.filter(prod => {
        const quantity = prod.quantity;
        const stock = prod.product.stock;
        if(quantity > stock) {
            notEnoughStock.push(prod);
        } else {
            enoughStock.push(prod);
        }
    })

    if(notEnoughStock.length > 0){
        const result = [];
        notEnoughStock.forEach(async prod => {
            const pid = prod.product._id;
            const stock = prod.product.stock;
            result.push(prod.product.title);
            await cartsRepository.updateProductQuantity(cid, pid, stock);
        })
        return result;
    }

    enoughStock.forEach(async prod => {
        const pid = prod.product._id;
        const price = prod.product.price;
        const quantity = prod.quantity;
        amount += (price * quantity);
        prod.product.stock -= quantity;

        if(prod.product.stock <= 0 ){
            prod.product.stock = 0;
            prod.product.status = false;
        }

        await productsRepository.updateProduct(pid, prod.product);
        await cartsRepository.deleteProductInCart(cid, pid);
    })

    const ticket = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: parseFloat(amount.toFixed(2)),
        purchaser
    }
    const result = await ticketsRepository.createTicket(ticket);
    // Envio de mail
    await transporter.sendMail({
        from: "coderHouse 39760",
        to: purchaser,
        subject: "Confirmación de compra",
        html: `<div class="col"><h1>Muchas gracias por su compra.</h1><p>Se ha confirmado su compra por un importe de $${amount}</p></div>`
    })
    return result;
}

export {
    getCarts,
    getCartById,
    createCart,
    addOneProductInCart,
    deleteProductInCart,
    addManyProductsInCart,
    updateProductQuantity,
    emptyCart,
    makePurchase
}
