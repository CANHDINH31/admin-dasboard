import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class FakeProductsSeed {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

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
    'Razer Blade 15',
    'GoPro Hero 11 Black',
    'Fitbit Sense 2',
    'Sony PlayStation 5',
    'Microsoft Xbox Series X',
    'Oculus Quest 3',
    'Samsung Galaxy Buds2 Pro',
    'Apple Mac Studio',
    'ASUS ROG Strix G15',
    'Lenovo ThinkPad X1 Carbon',
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

  async seed(count: number = 30) {
    console.log(`Starting to seed ${count} fake products...`);

    const existingProducts = await this.productModel.countDocuments();
    if (existingProducts > 10) {
      console.log('Products already exist, skipping fake product seeding...');
      return;
    }

    const productsToCreate: Array<Partial<Product>> = [];
    const usedSKUs = new Set();
    const usedUPCs = new Set();

    for (let i = 0; i < count; i++) {
      let sku, upc;
      do {
        sku = this.generateRandomString('SKU');
      } while (usedSKUs.has(sku));
      usedSKUs.add(sku);

      do {
        upc = this.generateRandomUPC();
      } while (usedUPCs.has(upc));
      usedUPCs.add(upc);

      const productName =
        this.productNames[Math.floor(Math.random() * this.productNames.length)];
      const sitePrice = this.generateRandomPrice(50, 2000);
      const sellingPrice = sitePrice * (0.85 + Math.random() * 0.15); // 85-100% of site price

      const product: Partial<Product> = {
        sku,
        upc,
        wmid: this.generateRandomString('WM'),
        name: productName,
        sitePrice: Math.round(sitePrice * 100) / 100,
        sellingPrice: Math.round(sellingPrice * 100) / 100,
      };
      productsToCreate.push(product);
    }

    try {
      await this.productModel.insertMany(productsToCreate);
      console.log('✅ Fake products seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding products:', error);
      throw error;
    }
  }

  async clear() {
    await this.productModel.deleteMany({});
    console.log('All fake products cleared!');
  }
}
