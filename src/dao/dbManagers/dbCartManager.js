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
        const cart = await cartsModel.find({_id: cid, "products.$.product": {_id: pid}});
        console.log(cart);

        // if(cart){
        //     result = await cartsModel.updateOne(
        //         {_id: cid, "products.product": {_id: pid}}, 
        //         {$set: {"products.$.quantity": quantity + 1}}
        //         )
        // }else {
        //     result = await cartsModel.updateOne(
        //         {_id: cid}, 
        //         {$push: {products: {product: {_id: pid}, quantity: 1}}}
        //         );
        // }
        // return result;
        
    }
}