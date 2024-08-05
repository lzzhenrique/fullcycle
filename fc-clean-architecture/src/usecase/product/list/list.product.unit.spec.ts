import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUsecase from "./list.product.usecase";

describe("Test list products", () => {
    const productSpecifications = [
        { type: 'a', name: 'Product A', price: 40 },
        { type: 'b', name: 'Product B', price: 50 },
        { type: 'a', name: 'Product C', price: 60 },
        { type: 'b', name: 'Product D', price: 70 },
    ];

    const products = productSpecifications.map(spec => {
        return ProductFactory.create(spec.type, spec.name, spec.price)
    })

    const MockRepository = () => {
        return {
            find: jest.fn(),
            findAll: jest.fn().mockReturnValue(products),
            create: jest.fn(),
            update: jest.fn()
        }
    }

    it('should find all products', async () => {
        const productsRepository = MockRepository();
        const useCase = new ListProductUsecase(productsRepository);

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

        const output = await useCase.execute({});
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
    });
});