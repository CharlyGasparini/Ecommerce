import { usersRepository, cartsRepository } from "../repositories/index.js";
import { createHash } from "../utils.js";

const getUser = async (email) => {
    const user = await usersRepository.getUser(email);
    return user;
}

const createUser = async (data) => {
    const {first_name, last_name, email, age, password} = data;
    const cartId = cartsRepository.createCart({})._id;
    const user = {
        first_name,
        last_name,
        email,
        age,
        cart: cartId,
        password: createHash(password),
        role: "user"
    }
    const result = await usersRepository.createUser(user);
    return result;
}

const updateUser = async (email, newUser) => {
    const result = await usersRepository.updateUser(email, newUser);
    return result;
}


export {
    getUser,
    createUser,
    updateUser
}