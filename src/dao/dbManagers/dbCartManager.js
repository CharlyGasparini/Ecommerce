import { logger } from "../../utils/logger.js";
import cartsModel from "../models/carts.model.js";

export default class dbCartManager {
    constructor () {
        logger.info("Working carts with DB");
    }

    getAll = async () => {
        const carts = await cartsModel.find().lean();
        return carts;
    }

    getById = async (cid) => {
        const cart = await cartsModel.findOne({_id: cid}).lean();
        return cart;
    }

    create = async (cart) => {
        const result = await cartsModel.create(cart);
        return result;
    }

    addOne = async (cid, pid) => {
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

    deleteOne = async (cid, pid) => {
        const result = await cartsModel.updateOne(
            {_id: cid},
            {$pull: {products: {product: pid}}}
        )
        return result;
    }

    addMany = async (cid, products) => {
        const result = await cartsModel.updateOne(
            {_id: cid},
            {$set: {products: products}}
        )
        return result;
    }

    updateQuantityOne = async (cid, pid, quantity) => {
        const result = await cartsModel.updateOne(
            {_id: cid, products: {$elemMatch: {product: pid}}},
            {$set: {"products.$.quantity": quantity}}
        )
        return result;
    }

    deleteAll = async (cid) => {
        const result = await cartsModel.updateOne(
            {_id: cid},
            {$set: {products: []}}
        )
        return result;
    }

    delete = async (cid) => {
        const result = await cartsModel.deleteOne({_id: cid});
        return result;
    }
}