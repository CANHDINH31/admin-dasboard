import { Injectable, NotFoundException } from '@nestjs/common';
import type { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async findByAccount(account: string): Promise<Order[]> {
    return this.orderModel.find({ account }).exec();
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.orderModel.find({ status }).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.orderModel
      .find({
        orderDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
  }
}
