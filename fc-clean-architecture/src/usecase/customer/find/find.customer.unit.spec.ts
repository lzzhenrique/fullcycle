import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUSeCase from "./find.customer.usecase";

describe("Test find customer use case", () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });
    afterEach(async () => {
        await sequelize.close();
    });

    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    const MockRepository = () => {
        return {
            find: jest.fn().mockReturnValue(customer),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        }
    }

    it('should find a customer ', async () => {
        const customerRepository = MockRepository();
        const useCase = new FindCustomerUSeCase(customerRepository)

        const expectedOut = {
            id: "123",
            name: "Customer 1",
            address: {
                street: "Street 1",
                city: "City 1",
                number: 1,
                zip: "Zipcode 1",
            }
        };

        const result = await useCase.execute({id: "123"});
        expect(result).toEqual(expectedOut)
    });

    it('should NOT find a customer ', async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found");
        });
        const useCase = new FindCustomerUSeCase(customerRepository)

        expect(()=> {
            return useCase.execute({id: "123"});
        }).rejects.toThrow("Customer not found");
    });
})

