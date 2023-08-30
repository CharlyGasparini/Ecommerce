import { ProductsDao, CartsDao, UsersDao, TicketsDao, MessagesDao } from "../dao/factory.js";
import CartsRepository from "./cart.repositories.js";
import ProductsRepository from "./product.repositories.js";
import UsersRepository from "./user.repositories.js";
import TicketsRepository from "./ticket.repositories.js";
import MessagesRepository from "./message.repositories.js";

const cartsRepository = new CartsRepository(CartsDao);
const productsRepository = new ProductsRepository(ProductsDao);
const usersRepository = new UsersRepository(UsersDao);
const ticketsRepository = new TicketsRepository(TicketsDao);
const messagesRepository = new MessagesRepository(MessagesDao);

export {
    cartsRepository,
    productsRepository,
    usersRepository,
    ticketsRepository,
    messagesRepository
}
