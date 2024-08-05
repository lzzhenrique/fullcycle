import CustomerCreateUsecase from "./create.customer.usecase";

const input = {
    name: "John",
    address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
    },
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test create customer", () => {
    it('should create a customer', async() => {
        const customerRepository = MockRepository();
        const customerCreateUSeCase = new CustomerCreateUsecase(customerRepository);

        const output = await customerCreateUSeCase.execute(input);
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city,
            }
        })
    });

    it('should NOT create a customer', async() => {
        const customerRepository = MockRepository();
        const customerCreateUSeCase = new CustomerCreateUsecase(customerRepository);
        input.name = "";

        await expect(customerCreateUSeCase.execute(input)).rejects.toThrow(
            "Name is required"
        )
    });

    it('should NOT create a customer', async() => {
        const customerRepository = MockRepository();
        const customerCreateUSeCase = new CustomerCreateUsecase(customerRepository);
        input.address.street = "";

        await expect(customerCreateUSeCase.execute(input)).rejects.toThrow(
            "Street is required"
        )
    });
})