import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../schemas/account.schema';

@Injectable()
export class FakeAccountsSeed {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  private readonly marketplaces = ['eBay', 'Walmart', 'AMZ'];
  private readonly statuses = ['active', 'inactive', 'suspended', 'freeze'];

  private generateRandomMarketplace(): string {
    return this.marketplaces[
      Math.floor(Math.random() * this.marketplaces.length)
    ];
  }

  private generateRandomStatus(): string {
    return this.statuses[Math.floor(Math.random() * this.statuses.length)];
  }

  private generateRandomString(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
  }

  async seed(count: number = 30) {
    console.log(`Starting to seed ${count} fake accounts...`);

    const existingAccounts = await this.accountModel.countDocuments();
    if (existingAccounts > 10) {
      console.log('Accounts already exist, skipping fake account seeding...');
      return;
    }

    const accountsToCreate: Array<Partial<Account>> = [];
    const usedAccNames = new Set();

    for (let i = 0; i < count; i++) {
      let accName;
      do {
        accName = this.generateRandomString('acc');
      } while (usedAccNames.has(accName));
      usedAccNames.add(accName);

      const account: Partial<Account> = {
        marketplace: this.generateRandomMarketplace(),
        accName,
        profileName: this.generateRandomString('profile'),
        sheetID: this.generateRandomString('sheet'),
        accountInfo: this.generateRandomString('info'),
        proxy: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:8080`,
        clientID: this.generateRandomString('client'),
        clientSecret: this.generateRandomString('secret'),
        telegramId: `@telegram${Math.floor(Math.random() * 1000)}`,
        status: this.generateRandomStatus(),
      };
      accountsToCreate.push(account);
    }

    await this.accountModel.insertMany(accountsToCreate);
    console.log('Fake accounts seeded successfully!');
  }

  async clear() {
    await this.accountModel.deleteMany({});
    console.log('All fake accounts cleared!');
  }
}
