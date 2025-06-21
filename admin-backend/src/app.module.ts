import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { StatsModule } from './stats/stats.module';
import { SeedsModule } from './users/seeds/seeds.module';
import { SeedCommand } from './users/seeds/seed.command';
import { AccountsSeedsModule } from './accounts/seeds/seeds.module';
import { ProductSeedsModule } from './products/seeds/seeds.module';
import { ProductSeedCommand } from './products/seeds/seed.command';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommandModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-dashboard',
    ),
    UsersModule,
    AccountsModule,
    ProductsModule,
    OrdersModule,
    TasksModule,
    AuthModule,
    StatsModule,
    SeedsModule,
    AccountsSeedsModule,
    ProductSeedsModule,
  ],
  providers: [SeedCommand, ProductSeedCommand],
})
export class AppModule {}
