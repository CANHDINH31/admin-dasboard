import { Injectable } from '@nestjs/common';
import { FakeOrdersSeed } from './fake-orders.seed';

@Injectable()
export class SeedOrdersCommand {
  constructor(private readonly fakeOrdersSeed: FakeOrdersSeed) {}

  async execute(): Promise<void> {
    try {
      console.log('🌱 Seeding orders...');
      await this.fakeOrdersSeed.seed();
      console.log('✅ Orders seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding orders:', error);
      throw error;
    }
  }
}
