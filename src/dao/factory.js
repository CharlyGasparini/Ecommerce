import config from "../config/config.js";
import { logger } from "../utils/logger.js";

let CartsDao, ProductsDao, UsersDao, TicketsDao, MessagesDao;

switch (config.persistance) {
    case "MONGO":
        logger.info("Working on DB");
        const mongoose = await import("mongoose");
        await mongoose.connect(config.mongoUrl);
        const { default: CartsMongo } = await import("./dbManagers/dbCartManager.js");
        const { default: ProductsMongo } = await import("./dbManagers/dbProductManager.js");
        const { default: UsersMongo } = await import("./dbManagers/dbUserManager.js");
        const { default: TicketsMongo } = await import("./dbManagers/dbTicketManager.js");
        const { default: MessagesMongo } = await import("./dbManagers/dbMessageManager.js");
        CartsDao = new CartsMongo();
        ProductsDao = new ProductsMongo();
        UsersDao = new UsersMongo();
        TicketsDao = new TicketsMongo();
        MessagesDao = new MessagesMongo();
        break;

    case "FILES":
        logger.info("Working on Files");
        const { default: CartsFiles } = await import("./fileManagers/CartManager.js");
        const { default: ProductsFiles } = await import("./fileManagers/ProductManager.js");
        const { default: UsersFiles } = await import("./fileManagers/UserManager.js");
        const { default: TicketsFiles } = await import("./fileManagers/TicketManager.js");
        const { default: MessagesFiles } = await import("./fileManagers/MessageManager.js");
        CartsDao = new CartsFiles("./src/files/carts.json");
        ProductsDao = new ProductsFiles("./src/files/products.json");
        UsersDao = new UsersFiles("./src/files/users.json");
        TicketsDao = new TicketsFiles("./src/files/tickets.json");
        MessagesDao = new MessagesFiles("./src/files/messages.json");
        break;
}

export {
    CartsDao,
    ProductsDao,
    UsersDao,
    TicketsDao,
    MessagesDao
}