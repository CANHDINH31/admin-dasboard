import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AdminSeed } from './admin.seed';
import { FakeUsersSeed } from './fake-users.seed';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AdminSeed, FakeUsersSeed],
  exports: [AdminSeed, FakeUsersSeed],
})
export class SeedsModule {}
