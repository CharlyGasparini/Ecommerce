import transporter from "../config/nodemailer.config.js";
import { cartsRepository, productsRepository, ticketsRepository } from "../repositories/index.js";
import { v4 as uuidv4 } from 'uuid';
import { CartNotFound, SameOwner, NotEnoughStock } from "../utils/custom-exceptions.js";

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
    let itemList = "";
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
        notEnoughStock.forEach(async prod => {
            const pid = prod.product._id;
            const stock = prod.product.stock;
            await cartsRepository.updateProductQuantity(cid, pid, stock);
        })
        throw new NotEnoughStock("No hay stock suficiente de algunos productos, se modificarán las cantidades en el carrito");
    }

    enoughStock.forEach(prod => {
        const price = prod.product.price;
        const quantity = prod.quantity;
        amount += (price * quantity);

        itemList += `<p>${prod.product.title} x ${quantity}</p>`;
    })

    const items = enoughStock.map(prod => {
        const item = {
            title: prod.product.title,
            quantity: prod.quantity
        }
        return item;
    })

    const ticket = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        items,
        amount: parseFloat(amount.toFixed(2)),
        purchaser
    }

    // Envio de mail
    await transporter.sendMail({
        from: "coderHouse 39760",
        to: purchaser,
        subject: "Confirmación de compra",
        html: 
            `<div class="col">
                <h1>Muchas gracias por su compra.</h1>
                <h3>Items</h3>
                ${itemList}
                <p>Se ha confirmado su compra por un importe de $${amount}</p>
            </div>`
    })

    const result = await ticketsRepository.createTicket(ticket);

    enoughStock.forEach(async prod => {
        const pid = prod.product._id;
        const quantity = prod.quantity;
        prod.product.stock -= quantity;

        if(prod.product.stock === 0 ) 
            prod.product.status = false

        await productsRepository.updateProduct(pid, prod.product);
    })

    await cartsRepository.emptyCart(cid);
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
