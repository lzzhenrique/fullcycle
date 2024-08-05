import CreateProductUsecase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

const output = {
    name: "Product AAA",
    price: 70
}

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(ProductFactory.create('a', 'Product A', 40)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn().mockReturnValue(output),
    }
}

describe("Unit test for update product", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const createProductUseCase = new CreateProductUsecase(productRepository);
        const input = {
            type: 'a',
            name: 'Product A',
            price: 40
        }
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