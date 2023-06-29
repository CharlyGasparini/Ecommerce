import userModel from "../models/users.models.js";
import { createHash, isValidPassword } from "../../utils.js";
import dbCartManager from "./dbCartManager.js";

export default class dbUserManager {
    constructor() {
        console.log("Working users with DB");
    }

    get = async (email) => {
        const user = await userModel.findOne({email}).lean();
        return user;
    }

    add = async (data) => {
        const {first_name, last_name, email, age, password} = data;
        const cart = await new dbCartManager().add({});
        const cartId = cart._id;
        const user = {
            first_name,
            last_name,
            email,
            age,
            cart: cartId,
            password: createHash(password),
            role: "user"
        }

        return await userModel.create(user);
    }

    update = async (email, newUser) => {
        const result = await userModel.updateOne({email}, newUser);
        return result;
    }

    validate = async (email, password) => {
        const user = await this.get(email);
        
        if(!user) return false;
        
        if(!isValidPassword(user, password)) return false;

        return user;
    }
}