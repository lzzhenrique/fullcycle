import express, { Express } from "express";
import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../customer/repository/sequelize/customer.model";
import {customerRoute} from "./routes/customer.routes";
import {productRoute} from "./routes/products.routes";
import ProductModel from "../product/repository/sequelize/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/customers", customerRoute);
app.use("/products", productRoute);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    });

    await sequelize.addModels([CustomerModel, ProductModel]);
    await sequelize.sync();
}

setupDb();