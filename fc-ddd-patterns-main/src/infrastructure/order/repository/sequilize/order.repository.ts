import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findByPk(id, { include: [{ model: OrderItemModel }]});
        if (!orderModel) return null;

        const items = orderModel.items.map(
            (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        );

        return new Order(
            orderModel.id,
            orderModel.customer_id,
            items,
        );
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: [{ model: OrderItemModel }]});
        if (!orderModels) return null;

        return orderModels.map((orderModel: OrderModel) => {
            const items = orderModel.items.map(
                (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            );

            return new Order(
                orderModel.id,
                orderModel.customer_id,
                items,
            );
        })
    }

    update(entity: Order): Promise<void> {
        return Promise.resolve(undefined);
    }
}
