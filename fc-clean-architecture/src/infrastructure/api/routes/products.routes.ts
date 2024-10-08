import express, {Request, Response} from "express";
import CreateProductUsecase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import ListProductUsecase from "../../../usecase/product/list/list.product.usecase";
import CustomerPresenter from "../presenters/customer.presenter";
import ProductsPresenter from "../presenters/products.presenter";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new CreateProductUsecase(new ProductRepository());

    try {
        const productDto = {
            type: req.body.type,
            name: req.body.name,
            price: req.body.price,
        }

        const output = await usecase.execute(productDto);
        res.send(output);
    } catch (error) {
        res.status(500).send(error);
    }
})

productRoute.get('/', async (req: Request, res: Response) => {
    const usecase = new ListProductUsecase(new ProductRepository());
    try {
        const output = await usecase.execute({});
        res.format(({
            json: async () => res.send(output),
            xml: async () => res.send(ProductsPresenter.toXML(output)),
        }))
    } catch (error) {
        res.status(500).send(error);
    }
})