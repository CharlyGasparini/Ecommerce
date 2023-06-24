import userModel from "../models/users.models.js";
import { createHash, isValidPassword } from "../../utils.js";
import dbCartManager from "./dbCartManager.js";

export default class dbUserManager {
    constructor() {
        console.log("Working users with DB");
    }

    getUser = async (email) => {
        const user = await userModel.findOne({email}).lean();
        return user;
    }

    createUser = async (data) => {
        const {first_name, last_name, email, age, password} = data;
        const cart = await new dbCartManager().addCart({});
        const cartId = cart._id;
        const user = {
            first_name,
            last_name,
            email,
            age,
            cart: cartId,
            password: createHash(password)
        }

        return await userModel.create(user);
    }
}