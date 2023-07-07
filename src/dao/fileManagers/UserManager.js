import fs from "fs";
import { createHash, isValidPassword } from "../../utils.js";
import config from "../../config/config.js"
import CartManager from "./CartManager.js";

export default class UserManager {
    constructor(path) {
        this.path = path;
    }

    getAll = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8");
            const users = JSON.parse(data);
            return users;
        } else {
            return [];
        }
    }

    get = async (email) => {
        const users = await this.getAll();
        const user = users.find(user => user.email === email);
        return user;
    }

    add = async (data) => {
        const users = await this.getAll();
        const {first_name, last_name, email, age, password} = data;
        let newCart;
        let user;

        if(email === config.adminName && password === config.adminPassword){
            newCart = {products: [], admin: true};
            const cart = await new CartManager().add(newCart);
            user = {
                first_name,
                last_name,
                email,
                age,
                cart: cart._id,
                password: createHash(password),
                role: "admin"
            }
        } else {
            newCart = {products: [], admin: false};
            const cart = await new CartManager().add(newCart);
            user = {
                first_name,
                last_name,
                email,
                age,
                cart: cart._id,
                password: createHash(password),
                role: "user"
            }
        }

        users.push(user);
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, "\t"));
        return true;
    }

    update = async (email, newUser) => {
        const users = await this.getAll();
        const userIndex = users.findIndex(user => user.email === email);
        users.splice(userIndex, 1, newUser);
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, "\t"));
        return true;
    }

    validate = async (email, password) => {
        const user = await this.get(email);
        
        if(!user) return false;
        
        if(!isValidPassword(user, password)) return false;

        return user;
    }
}