import transporter from "../config/nodemailer.config.js";
import { productsRepository } from "../repositories/index.js";
import { NotOwnProduct, ProductNotFound } from "../utils/custom-exceptions.js";

const getProducts = async () => {
    const products = await productsRepository.getProducts();
    return products;
}

const getProductById = async (pid) => {
    const result = await productsRepository.getProductById(pid);
    if(!result){
        throw new ProductNotFound("No se encontró el producto");
    }
    return result;
}

const createProduct = async (product) => {
    const result = await productsRepository.createProduct(product);
    return result;
}

const updateProduct = async (pid, product) => {
    const result = await productsRepository.updateProduct(pid, product);
    return result;
}

const deleteProduct = async (pid, user) => {
    if(user.role === "premium") {
        const product = await getProductById(pid);
        
        if(product.owner !== user.email) {
            throw new NotOwnProduct("No puede borrar un producto creado por otro usuario o el administador");
        }

        await transporter.sendMail({
            from: "coderHouse 39760",
            to: user.email,
            subject: "Su producto a sido borrado",
            html:
                `
                <div class="col">
                    <h1>Producto borrado</h1>
                    <p>Le informamos que su producto: ${product.title}, ha sido borrado satisfactoriamente</p>
                </div>
                `
        })
    }

    const result = await productsRepository.deleteProduct(pid);
    return result;
}

export{
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}