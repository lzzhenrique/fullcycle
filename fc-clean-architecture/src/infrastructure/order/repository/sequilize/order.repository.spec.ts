import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const createOrder = async (orderRepository: OrderRepository) => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
    );

    const order = new Order("123", "123", [orderItem]);

    await orderRepository.create(order);

    return {
      order,
      orderItem
    }
  };

  const createOrders = async (orderRepository: OrderRepository, orderQuantity: number) => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    const orders = [];

    for (let index = 0; index < orderQuantity; index++) {
      const orderItem = new OrderItem(
          index.toString(),
          product.name,
          product.price,
          product.id,
          2
      );

      const order = new Order(index.toString(), "123", [orderItem]);

      await orderRepository.create(order);
      orders.push(order);
    }

    return orders;
  };

  it("should create a new order", async () => {
    const orderRepository = new OrderRepository();

    const {
      order,
      orderItem
    } = await createOrder(orderRepository);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });
  it("should find a new order by his pk", async () => {
    const orderRepository = new OrderRepository();

    const {order} = await createOrder(orderRepository);

    const orderFinded = await orderRepository.find(order.id);

    expect(order).toEqual(orderFinded);
  });
  it("should find all orders", async () => {
    const orderRepository = new OrderRepository();

    const orders = await createOrders(orderRepository, 5);

    const ordersFinded = await orderRepository.findAll();

    orders.forEach((order, index) => {
      expect(order).toEqual(ordersFinded[index]);
    });
  });
  it("should update a order", async () => {
    const orderRepository = new OrderRepository();
    const productRepository = new ProductRepository();

    const {order} = await createOrder(orderRepository);
    const orderDataBeforeUpdate =  {
      "itemsQuantity": order.items.length,
      "totalOrder": order.total()
    };

    const product = new Product("1234", "Product 2", 100);
    await productRepository.create(product);
    const product2 = new Product("12345", "Product 3", 20);
    await productRepository.create(product2);
    const product3 = new Product("123456", "Product 4", 50);
    await productRepository.create(product3);

    const newItem = new OrderItem("2", product.name, product.price, product.id, 2);
    const newItem2 = new OrderItem("3", product2.name, product2.price, product2.id, 4);
    const newItem3 = new OrderItem("4", product3.name, product3.price, product3.id, 6);

    const newItens = [newItem, newItem2, newItem3];
    newItens.forEach((item) => order.addItem(item));

    await orderRepository.update(order);
    const orderFindedAfterUpdate = await orderRepository.find(order.id);

    expect(orderFindedAfterUpdate).toEqual(order);
    expect(orderFindedAfterUpdate.items.length).not.toEqual(orderDataBeforeUpdate.itemsQuantity)
    expect(orderFindedAfterUpdate.total()).not.toEqual(orderDataBeforeUpdate.totalOrder)
  });
});
