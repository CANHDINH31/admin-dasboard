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
    // Calculate derived fields if not provided
    const orderData = { ...createOrderDto };

    if (
      !orderData.netProfit &&
      orderData.sellingPrice &&
      orderData.sourcingPrice
    ) {
      orderData.netProfit = orderData.sellingPrice - orderData.sourcingPrice;
      if (orderData.walmartFee) {
        orderData.netProfit -= orderData.walmartFee;
      }
    }

    if (!orderData.roi && orderData.netProfit && orderData.sourcingPrice) {
      orderData.roi = (orderData.netProfit / orderData.sourcingPrice) * 100;
    }

    const createdOrder = new this.orderModel(orderData);
    return createdOrder.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 25,
    search?: string,
    startDate?: string,
    endDate?: string,
    account?: string,
    trackingStatus?: string,
    sku?: string,
    shipByStart?: string,
    shipByEnd?: string,
  ): Promise<{
    data: Order[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const query: any = {};

    // Search filter for PO# and Name
    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) {
        query.orderDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.orderDate.$lte = new Date(endDate);
      }
    }

    // Account filter
    if (account) {
      query.orderNumEmail = { $regex: account, $options: 'i' };
    }

    // Tracking status filter
    if (trackingStatus) {
      query.trackingStatus = { $regex: trackingStatus, $options: 'i' };
    }

    // SKU filter
    if (sku) {
      query.sku = { $regex: sku, $options: 'i' };
    }

    // Ship by date range filter
    if (shipByStart || shipByEnd) {
      query.shipBy = {};
      if (shipByStart) {
        query.shipBy.$gte = new Date(shipByStart);
      }
      if (shipByEnd) {
        query.shipBy.$lte = new Date(shipByEnd);
      }
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.orderModel.countDocuments(query).exec(),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Recalculate derived fields if pricing changes
    const orderData = { ...updateOrderDto };

    if (
      orderData.sellingPrice ||
      orderData.sourcingPrice ||
      orderData.walmartFee
    ) {
      const currentOrder = await this.orderModel.findById(id).exec();
      if (currentOrder) {
        const sellingPrice =
          orderData.sellingPrice ?? currentOrder.sellingPrice;
        const sourcingPrice =
          orderData.sourcingPrice ?? currentOrder.sourcingPrice;
        const walmartFee = orderData.walmartFee ?? currentOrder.walmartFee ?? 0;

        orderData.netProfit = sellingPrice - sourcingPrice - walmartFee;
        orderData.roi = (orderData.netProfit / sourcingPrice) * 100;
      }
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, orderData, { new: true })
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

  async findByOrderNumber(orderNumber: string): Promise<Order[]> {
    return this.orderModel.find({ orderNumber }).exec();
  }

  async findByPoNumber(poNumber: string): Promise<Order[]> {
    return this.orderModel.find({ poNumber }).exec();
  }

  async findByTrackingStatus(trackingStatus: string): Promise<Order[]> {
    return this.orderModel.find({ trackingStatus }).exec();
  }

  async findBySku(sku: string): Promise<Order[]> {
    return this.orderModel.find({ sku }).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.orderModel
      .find({
        orderDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ orderDate: -1 })
      .exec();
  }

  async findByShipByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Order[]> {
    return this.orderModel
      .find({
        shipBy: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ shipBy: -1 })
      .exec();
  }

  async findHighProfitOrders(minProfit: number): Promise<Order[]> {
    return this.orderModel
      .find({ netProfit: { $gte: minProfit } })
      .sort({ netProfit: -1 })
      .exec();
  }

  async findHighROIOrders(minROI: number): Promise<Order[]> {
    return this.orderModel
      .find({ roi: { $gte: minROI } })
      .sort({ roi: -1 })
      .exec();
  }

  async getOrderStats() {
    const stats = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$sellingPrice', '$quantity'] } },
          totalCost: { $sum: { $multiply: ['$sourcingPrice', '$quantity'] } },
          totalProfit: { $sum: { $multiply: ['$netProfit', '$quantity'] } },
          avgROI: { $avg: '$roi' },
        },
      },
    ]);

    return (
      stats[0] || {
        totalOrders: 0,
        totalQuantity: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        avgROI: 0,
      }
    );
  }

  async getTrackingStatusStats() {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: '$trackingStatus',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
  }
}
