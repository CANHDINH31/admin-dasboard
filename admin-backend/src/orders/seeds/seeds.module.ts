import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../schemas/order.schema';
import { FakeOrdersSeed } from './fake-orders.seed';
import { SeedOrdersCommand } from './seed.command';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [FakeOrdersSeed, SeedOrdersCommand],
  exports: [FakeOrdersSeed],
})
export class OrdersSeedsModule {}
