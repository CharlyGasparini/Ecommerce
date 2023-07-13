import transporter from "../config/nodemailer.config.js";
import { cartsRepository, productsRepository, ticketsRepository } from "../repositories/index.js";
import { v4 as uuidv4 } from 'uuid';

const getCarts = async () => {
    const carts = await cartsRepository.getCarts();
    return carts;
}

const getCartById = async (cid) => {
    const result = await cartsRepository.getCartById(cid);
    return result;
}

const createCart = async (cart) => {
    const result = await cartsRepository.createCart(cart);
    return result;
}

const addOneProductInCart = async (cid, pid) => {
    const result = await cartsRepository.addOneProductInCart(cid, pid);
    return result;
}

const deleteProductInCart = async (cid, pid) => {
    const result = await cartsRepository.deleteProductInCart(cid, pid);
    return result;
}

const addManyProductsInCart = async (cid, products) => {
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
    const cartProducts = await cartsRepository.getCartById(cid).products;
    
    const { amounts, notEnoughStock } = cartProducts.reduce(
        async (acc, elem) => {
            const pid = elem.product._id;
            const quantity = elem.quantity;
            const product = await productsRepository.getProductById(pid);
            const stock = product.stock;
            const price = product.price;

            if(quantity > stock) {
                acc.notEnoughStock.push(pid);
                await cartsRepository.updateProductQuantity(cid, pid, stock);
            } else {
                acc.amounts.push(quantity*price);
                product.stock -= quantity;

                if(product.stock === 0) product.status = false;

                await productsRepository.updateProduct(pid, product);
                await cartsRepository.deleteProductInCart(cid, pid);
            }
        }
    )

    if(notEnoughStock.length > 0){
        return notEnoughStock;
    }
    
    const amount = amounts.reduce((acc, curr) => acc + curr, 0);
    const ticket = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount,
        purchaser
    }
    const result = await ticketsRepository.createTicket(ticket);
    // Envio de mail
    await transporter.sendMail({
        from: "coderHouse 39760",
        to: purchaser,
        subject: "Confirmación de compra",
        html: `<div class="col"><img src="./src/public/img/logo.png"><h1>Muchas gracias por su compra.</h1><p>Se ha confirmado su compra por un importe de $${amount}</p></div>`
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
