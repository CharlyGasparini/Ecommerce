import { usersRepository, cartsRepository } from "../repositories/index.js";
import { createHash, isValidPassword, generateToken } from "../utils/utils.js";
import config from "../config/config.js";
import { IncorrectCredentials, UserNotFound, UserAlreadyExists } from "../utils/custom-exceptions.js";
import transporter from "../config/nodemailer.config.js";

const getAllUsers = async () => {
    const users = await usersRepository.getAllUsers();
    return users;
}

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
        role: "user",
        lastActivity: new Date().getTime()
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

const changeRole = async (user) => {
    const email = user.email;
    
    if(user.role === "user") {
        user.role = "premium";
    } else {
        user.role = "user";
    }
    
    await updateUser(email, user);
    const accessToken = generateToken(user);
    return accessToken;
}

const updateLastActivity = async (activity) => {
    const email = activity.user;
    const user = await usersRepository.getUser(email);
    user.lastActivity = activity.time;
    const result = await usersRepository.updateUser(email, user);
    return result;
}

const deleteInactiveUsers48hs = async () => {
    const now = new Date().getTime();
    const users = await usersRepository.getAllUsers();
    let counter = 0;
    users.forEach(async user => {
        const lastActivity = user.lastActivity;
        const inactivityTime = (now - lastActivity) / 3600000;

        if(inactivityTime >= 48) {
            counter++;
            await transporter.sendMail({
                from: "coderHouse 39760",
                to: user.email,
                subject: "Su usuario ha sido borrado",
                html: 
                    `<div class="col">
                        <h1>Usuario borrado</h1>
                        <p>Debido a la falta de actividad por mas de 48hs, su usuario ha sido borrado de nuestra base de datos</p>
                    </div>`
            })

            await cartsRepository.deleteCart(user.cart);
            await usersRepository.deleteUser(user.email);
        } 
    });
    return counter;           
}

export {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    login,
    register, 
    changeRole, 
    updateLastActivity, 
    deleteInactiveUsers48hs
}