import cartsModel from "../models/carts.model.js";

export default class dbCartManager {
    constructor () {
        console.log("Working carts with DB");
    }

    getCarts = async () => {
        const carts = await cartsModel.find().lean();
        return carts;
    }

    getCartById = async (cid) => {
        const result = await cartsModel.find({_id: cid});
        return result;
    }

    addCart = async (cart) => {
        const result = await cartsModel.create(cart);
        return result;
    }

    addProductInCart = async (cid, pid) => {
        let result;
        const cart = await cartsModel.find({_id: cid, products: {$elemMatch: {product: pid}}});
        if(cart.length === 0){
            result = await cartsModel.updateOne(
                {_id: cid},
                {$push: {products: {product: pid, quantity: 1}}}
            )
        } else{
            result = await cartsModel.updateOne(
                {_id: cid, products: {$elemMatch: {product: pid}}},
                {$inc: {"products.$.quantity": 1}}
            )
        }
        return result;
    }

    deleteProductInCart = async (cid, pid) => {
        const result = await cartsModel.updateOne(
            {_id: cid},
            {$pull: {products: {product: pid}}}
        )
        return result;
    }

    fillCart = async (cid, products) => {
        const result = await cartsModel.updateOne(
            {_id: cid},
            {$set: {products: products}}
        )
        return result;
    }

    setQuantityOfProduct = async (cid, pid, quantity) => {
        const result = await cartsModel.updateOne(
            {_id: cid, products: {$elemMatch: {product: pid}}},
            {$set: {"products.$.quantity": quantity}}
        )
        return result;
    }

    emptyCart = async (cid) => {
        const result = await cartsModel.updateOne(
            {_id: cid},
            {$set: {products: []}}
        )
        return result;
    }
}