import FindProductUsecase from "./find.product.usecase";

const product = {
    id: "123",
    name: "Product A",
    price: 40
}
const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(product),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test find a product", () => {
    it("should find a product by his ID", async() => {
        const input = {
            id: '123'
        }

        const productRepository = MockRepository();
        const useCase = new FindProductUsecase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: output.id,
            name: output.name,
            price: output.price,
        })
    })
    it('should NOT find a product ', async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const useCase = new FindProductUsecase(productRepository)

        expect(()=> {
            return useCase.execute({id: "123"});
        }).rejects.toThrow('Product not found');
    });
})