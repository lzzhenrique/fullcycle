import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "../create/create.product.usecase";
import ListProductUsecase from "./list.product.usecase";

describe("Test list product usecase", () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });
    afterEach(async () => {
        await sequelize.close();
    });

    it('should find a products', async () => {
        const productRepository = new ProductRepository();
        const productSpecifications = [
            { type: 'a', name: 'Product A', price: 40 },
            { type: 'b', name: 'Product B', price: 50 },
            { type: 'a', name: 'Product C', price: 60 },
            { type: 'b', name: 'Product D', price: 70 },
        ];
        const createProductUseCase = new CreateProductUsecase(productRepository);

        productSpecifications.map(spec => {
            createProductUseCase.execute({
                type: spec.type,
                name: spec.name,
                price: spec.price
            })
        });

        const listProductsUseCase = new ListProductUsecase(productRepository);

        const expectedOuts = [
            {
                name: "Product A",
                price: 40

            },
            {
                name: "Product C",
                price: 60

            },
            {
                name: "Product B",
                price: 100

            },
            {
                name: "Product D",
                price: 140

            }
        ];

        const output = await listProductsUseCase.execute({});
        output.products.sort((a, b) => {
            if (a.price > b.price) return 1;
            if (a.price < b.price) return -1;
            return 0
        });

        expect(output.products.length).toEqual(expectedOuts.length);
        output.products.forEach((product, index) => {
            expect(product).toEqual({
                id: expect.any(String),
                name: expectedOuts[index].name,
                price: expectedOuts[index].price,
            });
        });
    })
});