import CartManager from "../src/managers/CartManager.js";

const cartManager = new CartManager("./src/files/carts.json");

const env = async () => {
    let result = await cartManager.getCarts();
    console.log(result);

    await cartManager.addCart(
        {
            products:[
                {
                    product: {
                        id: 1,
                    },
                    quantity: 5
                },
                {
                    product: {
                        id: 7,
                    },
                    quantity: 4
                },
                {
                    product: {
                        id: 4,
                    },
                    quantity: 1
                }
            ]
        }
    )

    await cartManager.addCart(
        {
            products:[
                {
                    product: {
                        id: 7,
                    },
                    quantity: 10
                },
            ]
        }
    )

    await cartManager.addCart(
        {
            products:[
                {
                    product: {
                        id: 2,
                    },
                    quantity: 1
                },
                {
                    product: {
                        id: 9,
                    },
                    quantity: 20
                },
            ]
        }
    )

    result = await cartManager.getCarts();
    console.log(result);

    await cartManager.addProductInCart(2,5);
    await cartManager.addProductInCart(1,1);

    result = await cartManager.getCartById(2);
    console.log(result);
    result = await cartManager.getCartById(1);
    console.log(result);
}

env();