import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class FakeOrdersSeed {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  private readonly trackingStatuses = [
    'Pending',
    'Processing',
    'Shipped',
    'In Transit',
    'Delivered',
    'Cancelled',
    'Returned',
  ];

  private readonly productNames = [
    'iPhone 15 Pro Max',
    'Samsung Galaxy S24 Ultra',
    'MacBook Air M3',
    'iPad Pro 12.9-inch',
    'Dell XPS 13',
    'Sony WH-1000XM5',
    'AirPods Pro',
    'Google Pixel 8 Pro',
    'Microsoft Surface Laptop',
    'Apple Watch Series 9',
    'Sony A7 IV Camera',
    'Nintendo Switch OLED',
    'Bose QuietComfort 45',
    'Samsung Galaxy Tab S9',
    'HP Spectre x360',
    'Canon EOS R6',
    'DJI Mini 3 Pro',
    'Garmin Fenix 7',
    'Logitech MX Master 3S',
    'Samsung Odyssey G9 Monitor',
  ];

  private readonly cities = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA',
    'Austin, TX',
    'Jacksonville, FL',
    'Fort Worth, TX',
    'Columbus, OH',
    'Charlotte, NC',
    'San Francisco, CA',
    'Indianapolis, IN',
    'Seattle, WA',
    'Denver, CO',
    'Washington, DC',
  ];

  private generateRandomString(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private generateRandomPrice(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }

  private generateRandomUPC(): string {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000 + '';
  }

  private generateRandomAddress(): string {
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const streetNames = [
      'Main St',
      'Oak Ave',
      'Pine St',
      'Elm St',
      'Maple Dr',
      'Cedar Ln',
      'Birch Rd',
      'Spruce Way',
      'Willow Ct',
      'Ash Blvd',
    ];
    const streetName =
      streetNames[Math.floor(Math.random() * streetNames.length)];
    const city = this.cities[Math.floor(Math.random() * this.cities.length)];
    const zipCode = Math.floor(Math.random() * 90000) + 10000;

    return `${streetNumber} ${streetName}, ${city} ${zipCode}`;
  }

  private generateRandomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  async seed(count: number = 50) {
    console.log(`Starting to seed ${count} fake orders...`);

    const existingOrders = await this.orderModel.countDocuments();
    if (existingOrders > 10) {
      console.log('Orders already exist, skipping fake order seeding...');
      return;
    }

    const ordersToCreate: Array<Partial<Order>> = [];
    const usedOrderNumbers = new Set();
    const usedPONumbers = new Set();

    for (let i = 0; i < count; i++) {
      let orderNumber, poNumber;
      do {
        orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      } while (usedOrderNumbers.has(orderNumber));
      usedOrderNumbers.add(orderNumber);

      do {
        poNumber = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      } while (usedPONumbers.has(poNumber));
      usedPONumbers.add(poNumber);

      const productName =
        this.productNames[Math.floor(Math.random() * this.productNames.length)];
      const sellingPrice = this.generateRandomPrice(20, 2000);
      const sourcingPrice = sellingPrice * (0.3 + Math.random() * 0.4); // 30-70% of selling price
      const walmartFee = sellingPrice * (0.05 + Math.random() * 0.08); // 5-13% of selling price
      const netProfit = sellingPrice - sourcingPrice - walmartFee;
      const roi = (netProfit / sourcingPrice) * 100;
      const commission = sellingPrice * (0.02 + Math.random() * 0.03); // 2-5% of selling price

      const orderDate = this.generateRandomDate(
        new Date('2024-01-01'),
        new Date(),
      );
      const shipBy = new Date(
        orderDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000,
      ); // 0-7 days after order

      const order: Partial<Order> = {
        trackingStatus:
          this.trackingStatuses[
            Math.floor(Math.random() * this.trackingStatuses.length)
          ],
        orderNumEmail: `order${String(i + 1).padStart(3, '0')}@example.com`,
        poNumber,
        orderNumber,
        orderDate,
        shipBy,
        customerShippingAddress: this.generateRandomAddress(),
        quantity: Math.floor(Math.random() * 10) + 1,
        sku: this.generateRandomString('SKU'),
        sellingPrice: Math.round(sellingPrice * 100) / 100,
        sourcingPrice: Math.round(sourcingPrice * 100) / 100,
        walmartFee: Math.round(walmartFee * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        commission: Math.round(commission * 100) / 100,
        upc: this.generateRandomUPC(),
        name: productName,
      };
      ordersToCreate.push(order);
    }

    try {
      await this.orderModel.insertMany(ordersToCreate);
      console.log('✅ Fake orders seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding orders:', error);
      throw error;
    }
  }

  async clear() {
    await this.orderModel.deleteMany({});
    console.log('All fake orders cleared!');
  }
}
