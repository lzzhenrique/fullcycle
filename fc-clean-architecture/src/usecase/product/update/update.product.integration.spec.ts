import CreateProductUsecase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";


describe("Integration test for update product", () => {
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

    it("should update a product", async () => {
        const input = {
            type: 'a',
            name: 'Product A',
            price: 40
        }
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUsecase(productRepository);
        const productToBeUpdated = await createProductUseCase.execute(input);

        const updateProductUseCase = new UpdateProductUseCase(productRepository);
        const productUpdated = await updateProductUseCase.execute({
            id: productToBeUpdated.id,
            name: 'Product AAA',
            price: 70
        });

        expect(productUpdated).toEqual({
            id: expect.any(String),
            name: 'Product AAA',
            price: 70,
        });
    })
})