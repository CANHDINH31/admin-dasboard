import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { FakeProductsSeed } from './fake-products.seed';

@Injectable()
export class ProductSeedCommand {
  constructor(private readonly fakeProductsSeed: FakeProductsSeed) {}

  @Command({
    command: 'seed:products',
    describe: 'Seed fake products',
  })
  async seed() {
    await this.fakeProductsSeed.seed();
  }

  @Command({
    command: 'seed:products:clear',
    describe: 'Clear all fake products',
  })
  async clear() {
    await this.fakeProductsSeed.clear();
  }
}
