import {Sequelize} from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

describe("Test create product use case", () => {
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

    it('should create a product', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUsecase(productRepository);

        const input = {
            type: "a",
            name: "Product A",
            price: 40
        }

        const product = await useCase.execute(input);
        expect(product).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        })
    });

    it('should NOT create a product when the type is not supported by the factory ', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUsecase(productRepository);

        const input = {
            type: 'c',
            name: 'Product A',
            price: 40
        }

        await expect(useCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        )
    })

    it('should NOT create a product when the price is below 0', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUsecase(productRepository);

        const input = {
            type: 'b',
            name: 'Product A',
            price: -40
        }

        await expect(useCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        )
    })

    it('should NOT create a product when the name is not defined', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUsecase(productRepository);

        const input = {
            type: 'b',
            name: '',
            price: 40
        }


        await expect(useCase.execute(input)).rejects.toThrow(
            "Name is required"
        )
    })
})