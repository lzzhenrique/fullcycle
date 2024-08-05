import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import {InputListCustomerDto, OutputListCustomerDto} from "./list.customer.dto";

export default class ListCustomerUsecase {
    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    async execute(): Promise<OutputListCustomerDto> {
        const customers = await this.customerRepository.findAll();

        const customersOutput = customers.map((customer) => {
            return {
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.Address.street,
                    city: customer.Address.city,
                    number: customer.Address.number,
                    zip: customer.Address.zip,
                }
            }
        });

        return {customers: customersOutput};
    };
}