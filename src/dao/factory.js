import config from "../config/config.js";

let CartsDao, ProductsDao, UsersDao;

switch (config.persistance) {
    case "MONGO":
        console.log("Working on DB");
        const mongoose = await import("mongoose");
        await mongoose.connect(config.mongoUrl);
        const { default: CartsMongo } = await import("./dbManagers/dbCartManager.js");
        const { default: ProductsMongo } = await import("./dbManagers/dbProductManager.js");
        const { default: UsersMongo } = await import("./dbManagers/dbUserManager.js");
        const { default: TicketsMongo } = await import("./dbManagers/dbTicketManager.js");
        CartsDao = new CartsMongo();
        ProductsDao = new ProductsMongo();
        UsersDao = new UsersMongo();
        TicketsDao = new TicketsMongo();
        break;

    case "FILES":
        console.log("Working on Files");
        const { default: CartsFiles } = await import("./fileManagers/CartManager.js");
        const { default: ProductsFiles } = await import("./fileManagers/ProductManager.js");
        const { default: UsersFiles } = await import("./fileManagers/UserManager.js");
        const { default: TicketsFiles } = await import("./fileManagers/TicketManager.js");
        CartsDao = new CartsFiles("../files/carts.json");
        ProductsDao = new ProductsFiles("../files/products.json");
        UsersDao = new UsersFiles("../files/users.json");
        TicketsDao = new TicketsFiles("../files/tickets.json");
        break;
}

export {
    CartsDao,
    ProductsDao,
    UsersDao,
    TicketsDao
}