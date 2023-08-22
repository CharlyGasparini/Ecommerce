import chai from "chai";
import supertest from "supertest";
import config from "../../../src/config/config.js";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

await mongoose.connect("mongodb+srv://crgasparini32:GSNltCfSNvAcw1xd@cluster39760cg.jgxfm1z.mongodb.net/testing?retryWrites=true&w=majority");
const expect = chai.expect;
const requester = supertest(`http://locahost:${config.port}`);

describe("Testing de productos", () => {
    before(async () => {
        try {
            await mongoose.connection.collections.carts.drop();
        } catch (error) {
            console.log(error);
        }
    })

    before(async () => {
        const loginResult = await requester.post("/api/sessions/login").send(
            {
                email: "crg@gmail.com",
                password: "1234"
            }
        )
        const cookieResult =loginResult.headers["set-cookie"][0];
        const cookieResultSplit = cookieResult.split("=");
        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        }
    }
    )

    it("POST de /api/products debe crear un producto correctamente", async () => {
        const mockProduct = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            code: faker.random.alphaNumeric(6),
            stock: faker.random.numeric(1),
            category: faker.helpers.arrayElement(["consolas", "juegos", "accesorios"])
        }

        const result = await requester.post("/api/products")
            .set("Cookie", [`${cookie.name}=${cookie.value}`])
            .field("title", mockProduct.title)
            .field("description", mockProduct.description)
            .field("price", mockProduct.price)
            .field("code", mockProduct.code)
            .field("stock", mockProduct.stock)
            .field("category", mockProduct.category)
            .attach("files", "./test/integration/Products/logo.png")

        expect(result.status).to.be.equal(200);
        expect(result._body.data).to.have.property("_id");
        expect(result._body.data).to.have.property("owner");
        expect(result._body.data).to.have.property("status");
        expect(result._body.data).to.have.property("thumbnails");
        expect(result._body.data.thumbnails.lenght).to.be.equal(2);
    });
})