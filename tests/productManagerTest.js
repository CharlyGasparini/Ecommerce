import ProductManager from "../src/managers/ProductManager.js";

const productManager = new ProductManager("./src/files/products.json");

const env = async () => {
    let products = await productManager.getProducts();
    console.log(products);

    for(let i = 0; i < 10; i++){
        await productManager.addProduct(
            {
                title:`producto${i+1}`,
                description: "lorem ipsum",
                price: Number((Math.random()*100 + 1).toFixed(2)),
                code:`abc12${i}`,
                stock: Math.floor(Math.random()*10 + 1),
                category: "lorem"
            }
        )
    }

    products = await productManager.getProducts();
    console.log(products);

    await productManager.updateProduct(3,
        {
            title: "titulo modificado",
            price: 32.5
        }
    )

    products = await productManager.getProductById(3);
    console.log(products);

    await productManager.deleteProduct(9);

    products = await productManager.getProductById(9);
    console.log(products);
    
    products = await productManager.getProducts();
    console.log(products);

}

env();
