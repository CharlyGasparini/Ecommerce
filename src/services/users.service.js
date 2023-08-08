import { usersRepository, cartsRepository } from "../repositories/index.js";
import { createHash, isValidPassword, generateToken } from "../utils/utils.js";
import config from "../config/config.js";
import { IncorrectCredentials, UserNotFound, UserAlreadyExists } from "../utils/custom-exceptions.js";
import transporter from "../config/nodemailer.config.js";

const getUser = async (email) => {
    const user = await usersRepository.getUser(email);
    return user;
}

const createUser = async (data) => {
    const {first_name, last_name, email, age, password} = data;
    const cart = await cartsRepository.createCart({products: []});
    const cid = cart._id;
    const user = {
        first_name,
        last_name,
        email,
        age,
        cart: cid,
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

const login = async (email, password) => {
    if(email === config.adminName && password === config.adminPassword){
        // Generación del token
        const accessToken = generateToken({
            first_name: "Coder",
            last_name: "House",
            email,
            role: "admin"
        })

        return accessToken;
    }

    const user = await getUser(email);
    
    if(!user) {
        throw new UserNotFound("El usuario no existe");
    }
    
    const comparePassword = isValidPassword(user, password);
    
    if(!comparePassword) {
        throw new IncorrectCredentials("Contraseña incorrecta");
    }
    
    const accessToken = generateToken(user);
    return accessToken;
}

const register = async (data) => {
    const userExists = await getUser(data.email);

    if(userExists) {
        throw new UserAlreadyExists(`Ya existe un usuario registrado con el mail ${data.email}`);
    }

    const result = await createUser(data);
    return result;
}

export {
    getUser,
    createUser,
    updateUser,
    login,
    register
}