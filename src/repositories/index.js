import { ProductsDao, CartsDao, UsersDao } from "../dao/factory.js";
import CartsRepository from "./cart.repositories.js";
import ProductsRepository from "./product.repositories.js";
import UsersRepository from "./user.repositories.js";

const cartsRepository = new CartsRepository(CartsDao);
const productsRepository = new ProductsRepository(ProductsDao);
const usersRepository = new UsersRepository(UsersDao);

export {
    cartsRepository,
    productsRepository,
    usersRepository
}
