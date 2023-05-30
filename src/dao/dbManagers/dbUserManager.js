import userModel from "../models/users.models.js";
import crypto from "crypto";

export default class dbUserManager {
    constructor() {
        console.log("Working users with DB");
    }

    getUser = async (email) => {
        const user = await userModel.findOne({email});
        return user;
    }

    createUser = async (data) => {
        const {first_name, last_name, email, age, password} = data;
        
        const user = {
            first_name,
            last_name,
            email,
            age,
            password,
            role: email === "adminCoder@coder.com" ? "admin" : "user"
        }

        user.salt = crypto.randomBytes(128).toString("base64");
        user.password = crypto.createHmac("sha256", user.salt)
        .update(user.password).digest("hex");

        await userModel.create(user);
    }

    validateUser = async (email, password) => {
        const user = await this.getUser(email);
        
        if(!user) return {status: false, payload: "User not found"};

        const newHash = crypto.createHmac("sha256", user.salt)
        .update(password).digest("hex");

        if(newHash === user.password)  return {status: true, payload: user};
        else return {status: false, payload: "Incorrect password"};;
    }
}