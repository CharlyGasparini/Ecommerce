import { USERSDAO } from "../dao/index.js";

const getUser = async (email) => {
    const user = await USERSDAO.get(email);
    return user;
}

const createUser = async (data) => {
    const result = await USERSDAO.add(data);
    return result;
}

const updateUser = async (email, newUser) => {
    const result = await USERSDAO.update(email, newUser);
    return result;
}

const validateUser = async (email, password) => {
    const result = await USERSDAO.validate(email, password);
    return result;
}

export {
    getUser,
    createUser,
    updateUser,
    validateUser
}