import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUsecase from "./update.customer.usecase";


const customer = CustomerFactory.createWithAddress(
    'John',
    new Address('Street', 123, 'Zip', 'City')
)

const input = {
    id: customer.id,
    name: "John Updated",
    address: {
        street: "Street updated",
        city: " City updated",
        number: 1234,
        zip: "Zip updated",
    }
}

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    };
};

describe("Unit test for customer update", () => {
    it("should update a customer", async () => {
        const customerRepository = MockRepository();
        const useCase = new UpdateCustomerUsecase(customerRepository)

        const output = await useCase.execute(input);
        expect(output).toEqual(input);
    })
})