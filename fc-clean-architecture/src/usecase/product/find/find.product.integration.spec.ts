import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUsecase from "./find.product.usecase";
import CreateProductUsecase from "../create/create.product.usecase";

describe("Test find a product usecase", () => {
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

    it('should find a product', async() => {
        const createProductInput = {
            type: "a",
            name: "Product A",
            price: 40
        }
        const productRepository = new ProductRepository()
        const createUseCase = new CreateProductUsecase(productRepository);
        const createProductOutput = await createUseCase.execute(createProductInput);


        const findInput = {
            id: createProductOutput.id
        }
        const findUseCase = new FindProductUsecase(productRepository);
        const product = await findUseCase.execute(findInput);

        expect(product).toEqual({
            id: expect.any(String),
            name: createProductInput.name,
            price: createProductInput.price,
        })
    });
})