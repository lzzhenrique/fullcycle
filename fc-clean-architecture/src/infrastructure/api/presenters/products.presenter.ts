import { toXML } from "jstoxml";
import {OutputListCustomerDto} from "../../../usecase/customer/list/list.customer.dto";
import {OutputListProductDto} from "../../../usecase/product/list/list.product.dto";

export default class ProductsPresenter {
    static toXML(data: OutputListProductDto): string {
        const xmlOptions = {
            header: true,
            indent: " ",
            newLine: "\n",
            allowEmpty: true,
        };

        const obj = {
            products: {
                product: data.products.map((product) => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                })),
            },
        };

        return toXML(obj, xmlOptions)
    }
}