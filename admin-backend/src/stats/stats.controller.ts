import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return await this.statsService.getDashboardStats();
  }

  @Get('charts')
  async getChartData() {
    return await this.statsService.getChartData();
  }
}
