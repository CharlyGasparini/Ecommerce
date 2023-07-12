import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default class UserManager {
    constructor(path) {
        this.path = path;
        console.log("Working users with Files");
    }

    #getAll = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8");
            const users = JSON.parse(data);
            return users;
        } else {
            return [];
        }
    }

    get = async (email) => {
        const users = await this.#getAll();
        const user = users.find(user => user.email === email);
        return user;
    }

    create = async (user) => {
        const users = await this.#getAll();
        user._id = uuidv4();
        users.push(user);
        const result = await fs.promises.writeFile(this.path, JSON.stringify(users, null, "\t"));
        return result;
    }

    update = async (email, newUser) => {
        const users = await this.#getAll();
        const userIndex = users.findIndex(user => user.email === email);
        users.splice(userIndex, 1, newUser);
        const result = await fs.promises.writeFile(this.path, JSON.stringify(users, null, "\t"));
        return result;
    }
}