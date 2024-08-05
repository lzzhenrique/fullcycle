import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import {OutputUpdateCustomerDto, InputUpdateCustomerDto} from "./update.customer.dto";
import Address from "../../../domain/customer/value-object/address";

export default class UpdateCustomerUsecase {
    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    async execute(input: InputUpdateCustomerDto): Promise<OutputUpdateCustomerDto> {
        const customer = await this.customerRepository.find(input.id);
        const inputAddress =  input.address;
        const newAddress = new Address(inputAddress.street, inputAddress.number, inputAddress.zip, inputAddress.city);
        customer.changeAddress(newAddress);
        customer.changeName(input.name);

        await this.customerRepository.update(customer);

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
    }
}