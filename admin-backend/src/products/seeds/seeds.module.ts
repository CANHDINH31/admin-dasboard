import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { FakeProductsSeed } from './fake-products.seed';
import { ProductSeedCommand } from './seed.command';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [FakeProductsSeed, ProductSeedCommand],
  exports: [FakeProductsSeed, ProductSeedCommand],
})
export class ProductSeedsModule {}
