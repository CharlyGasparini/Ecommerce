import chai from "chai";
import supertest from "supertest";
import config from "../../../src/config/config.js";
import { v4 as uuidv4 } from 'uuid';

const expect = chai.expect;
const requester = supertest(`http://locahost:${config.port}`);

describe("Testing de productos", () => {
    let cookie

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
            title: "nuevo Producto",
            description: "Este es un nuevo producto",
            price: 120,
            code: uuidv4().substring(0, 6),
            stock: 10,
            category: "consola"
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
        expect(result._body.status).to.have.property("owner");
        expect(result._body.status).to.have.property("status");
        expect(result._body.status).to.have.property("thumbnails");
        expect(result._body.status.thumbnails.lenght).to.be.equal(2);
    });
})