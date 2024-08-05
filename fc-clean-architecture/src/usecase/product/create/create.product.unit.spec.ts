import CreateProductUsecase from "./create.product.usecase";



const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test create a product", () => {
    it('should create a product ', async () => {
        const input = {
            type: 'a',
            name: 'Product A',
            price: 40
        }

        const productRepository = MockRepository();
        const useCase = new CreateProductUsecase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        })
    })

    it('should NOT create a product when the type is not supported by the factory ', async () => {
        const input = {
            type: 'c',
            name: 'Product A',
            price: 40
        }
        const productRepository = MockRepository();
        const useCase = new CreateProductUsecase(productRepository);

        await expect(useCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        )
    })

    it('should NOT create a product when the price is below 0', async () => {
        const input = {
            type: 'b',
            name: 'Product A',
            price: -40
        }
        const productRepository = MockRepository();
        const useCase = new CreateProductUsecase(productRepository);

        await expect(useCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        )
    })

    it('should NOT create a product when the name is not defined', async () => {
        const input = {
            type: 'b',
            name: '',
            price: 40
        }
        const productRepository = MockRepository();
        const useCase = new CreateProductUsecase(productRepository);

        await expect(useCase.execute(input)).rejects.toThrow(
            "Name is required"
        )
    })
})