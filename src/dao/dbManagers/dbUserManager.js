import userModel from "../models/users.models.js";
import { createHash, isValidPassword } from "../../utils.js";

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
            password: createHash(password),
            role: email === "adminCoder@coder.com" ? "admin" : "user"
        }

        await userModel.create(user);
    }

    validateUser = async (email, password) => {
        const user = await this.getUser(email);

        if(!user) return {status: false, payload: "Usuario no encontrado"};
        
        if(!isValidPassword(user, password)) return {status: false, payload: "Contraseña incorrecta"};

        return {status: true, payload: user};
    }
}