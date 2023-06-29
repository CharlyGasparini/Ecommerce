import mongoCartsDao from "./dbManagers/dbCartManager.js";
import mongoProductsDao from "./dbManagers/dbProductManager.js";
import mongoUsersDao from "./dbManagers/dbUserManager.js";

// import filesCartsDao from "./fileManagers/CartManager.js";
// import filesProductsDao from "./fileManagers/ProductManager.js";
// import mongoUsersDao from "./fileManagers/UsersManager.js";

// const condition = config.persistanse === "MONGO";

// export  const CARTSDAO = condition ? new mongoCartsDao() : new filesCartsDao("./files/carts.json");
// export  const PRODUCTSDAO = condition ? new mongoProductsDao() : new filesProductsDao("./files/products.json");
// export const USERSDAO = condition ? new mongoUsersDao() : new filesUsersDao("./files/users.json");

export  const CARTSDAO =  new mongoCartsDao();
export  const PRODUCTSDAO = new mongoProductsDao();
export const USERSDAO = new mongoUsersDao();

