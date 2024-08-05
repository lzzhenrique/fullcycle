import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {InputListProductDto, OutputListProductDto} from "./list.product.dto";
import ProductInterface from "../../../domain/product/entity/product.interface";

export default class ListProductUsecase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this.productRepository.findAll();

        const productsOutput = products.map((product: ProductInterface) => {
            return {
                id: product.id,
                name: product.name,
                price: product.price
            }
        })

        return { products: productsOutput }
    }
}