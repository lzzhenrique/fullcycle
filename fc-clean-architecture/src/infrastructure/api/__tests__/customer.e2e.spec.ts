import {sequelize, app} from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
    beforeEach(async () => await sequelize.sync({force: true}));
    afterAll(async () => await sequelize.close());

    it("should be able to create a customer", async () => {
        const response = await request(app)
        .post("/customers")
        .send({
            name: "John",
            address: {
                street: "Street 1",
                city: "City 1",
                number: 123,
                zip: "12345"
            }
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John");
        expect(response.body.address.street).toBe("Street 1");
        expect(response.body.address.city).toBe("City 1");
        expect(response.body.address.number).toBe(123);
        expect(response.body.address.zip).toBe("12345");
    })
    it("should not create a customer", async () => {
        const response = await request(app)
            .post("/customers")
            .send({
                address: {
                    street: "Street 1",
                    city: "City 1",
                    number: 123,
                    zip: "12345"
                }
            });

        expect(response.status).toBe(500);
    })

    it("should list customers", async () => {
        const response1 = await request(app)
            .post("/customers")
            .send({
                name: "John",
                address: {
                    street: "Street 1",
                    city: "City 1",
                    number: 123,
                    zip: "12345"
                }
            });
        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/customers")
            .send({
                name: "Mary",
                address: {
                    street: "Street 2",
                    city: "City 1",
                    number: 123,
                    zip: "12345"
                }
            });
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customers").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);

        const jonh = listResponse.body.customers[0];
        expect(jonh.id).toBeDefined();
        expect(jonh.name).toBe("John");
        expect(jonh.address.street).toBe("Street 1");

        const mary = listResponse.body.customers[1];
        expect(mary.id).toBeDefined();
        expect(mary.name).toBe("Mary");
        expect(mary.address.street).toBe("Street 2");
    })
})