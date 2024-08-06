import {sequelize, app} from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => await sequelize.sync({force: true}));
    afterAll(async () => await sequelize.close());

    it("should be able to create a product", async () => {
        const response = await request(app)
        .post("/products")
        .send({
            type: "a",
            name: "Product A",
            price: 50,
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product A");
        expect(response.body.price).toBe(50);
    })

    it("should list products", async () => {
        const response1 = await request(app)
            .post("/products")
            .send({
                type: "a",
                name: "Product A",
                price: 50,
            });
        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/products")
            .send({
                type: "b",
                name: "Product B",
                price: 100,
            });
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/products").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const productA = listResponse.body.products[0];
        expect(productA.id).toBeDefined();
        expect(productA.name).toBe("Product A");
        expect(productA.price).toBe(50);

        const productB = listResponse.body.products[1];
        expect(productB.id).toBeDefined();
        expect(productB.name).toBe("Product B");
        expect(productB.price).toBe(200);
    })
})