import chai from "chai";
import supertest from "supertest";
import config from "../../../src/config/config.js";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

await mongoose.connect("mongodb+srv://crgasparini32:GSNltCfSNvAcw1xd@cluster39760cg.jgxfm1z.mongodb.net/testing?retryWrites=true&w=majority");
const expect = chai.expect;
const requester = supertest(`http://locahost:${config.port}`);

describe("Testing de carritos", () => {
    before(async () => {
        try {
            await mongoose.connection.collections.carts.drop();
        } catch (error) {
            console.log(error);
        }
    })

    it("DELETE de /api/carts debe eliminar un producto de un carrito correctamente", async () => {
        const mockCart = {
            products: []
        }

        const mockProduct = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            code: faker.random.alphaNumeric(6),
            stock: faker.random.numeric(1),
            category: faker.helpers.arrayElement(["consolas", "juegos", "accesorios"])
        }
        
        const mockProductPost = await requester.post("/api/products").send(mockProduct);
        const productId = mockProductPost._body.data._id;
        const mockCartPost = await requester.post("/api/carts").send(mockCart);
        const cartId = mockCartPost._body.data._id;

        await requester.post(`/api/carts/${productId}/products/${cartId}`);

        const deleteResult = await requester.delete(`/api/carts/${cartId}/products/${productId}`);

        expect(deleteResult.status).to.be.equal(200);

        const getResult = await requester.get(`/api/carts/${cartId}`);
        const cart = getResult._body.data;

        expect(cart._id).to.be.equal(undefined);
    });
})