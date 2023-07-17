export default class PopulateDto {
    constructor(cart) {
        this.name = `${user.first_name} ${user.last_name}`,
        this.age = user.age,
        this.email = user.email,
        this.cart = user.cart,
        this.role = user.role
    }

    getProduct = async (pid) => {
        const productManager = new ProductManager("../../files/products.json");
        const product = await productManager.getById(pid);
        return product;
    }
}