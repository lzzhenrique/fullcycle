import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUsecase from "./list.customer.usecase";

describe("Test find all customers use case", () => {
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const customer2 = new Customer("1234", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);

    const MockRepository = () => {
        return {
            find: jest.fn(),
            findAll: jest.fn().mockReturnValue([customer, customer2]),
            create: jest.fn(),
            update: jest.fn()
        }
    }

    it('should find all customers', async () => {
        const customerRepository = MockRepository();
        const useCase = new ListCustomerUsecase(customerRepository)

        const expectedOut = {
            customers: [
                {
                    id: "123",
                    name: "Customer 1",
                    address: {
                        street: "Street 1",
                        city: "City 1",
                        number: 1,
                        zip: "Zipcode 1",
                    }
                },
                {
                    id: "1234",
                    name: "Customer 2",
                    address: {
                        street: "Street 2",
                        city: "City 2",
                        number: 2,
                        zip: "Zipcode 2",
                    }
                }
            ]
        }

        const output = await useCase.execute();
        expect(output.customers.length).toEqual(2);

        expect(output.customers[0].id).toEqual(customer.id);
        expect(output.customers[0].name).toEqual(customer.name);
        expect(output.customers[0].address.street).toEqual(customer.Address.street);

        expect(output.customers[1].id).toEqual(customer2.id);
        expect(output.customers[1].name).toEqual(customer2.name);
        expect(output.customers[1].address.street).toEqual(customer2.Address.street);

        expect(output).toEqual(expectedOut);
    });
})

