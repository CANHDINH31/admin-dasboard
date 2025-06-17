import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AdminSeed } from './admin.seed';

@Injectable()
export class SeedCommand {
  constructor(private readonly adminSeed: AdminSeed) {}

  @Command({
    command: 'seed:admin',
    describe: 'Seed admin user',
  })
  async seed() {
    await this.adminSeed.seed();
  }
}
