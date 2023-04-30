import ProductManager from "../src/managers/ProductManager.js";

const productManager = new ProductManager("./src/files/products.json");

const env = async () => {
    let products = await productManager.getProducts();
    console.log(products);

    await productManager.addProducts(
        {
            title: "tituloModificado",
            price: "10",
            description: "lorem ipsum",
            code: "abc511",
            stock: "4.3",
            category: "lorem"
        }
        )
                    
    products = await productManager.getProducts();
    console.log(products);

    await productManager.updateProduct(
        {
            id: 3,
            title: "titulo nuevo",
            price: 32.5
        }
    )

    await productManager.updateProduct(
        {
            id: 1,
            title: "titulo nuevo",
            price: 32.5
        }
    )

    products = await productManager.getProducts();
    console.log(products);

    await productManager.deleteProduct(3);
    await productManager.deleteProduct(1);

    products = await productManager.getProducts();
    console.log(products);

}

env();
