import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../schemas/account.schema';
import { FakeAccountsSeed } from './fake-accounts.seed';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [FakeAccountsSeed],
  exports: [FakeAccountsSeed],
})
export class AccountsSeedsModule {}
