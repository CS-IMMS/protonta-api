import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService) {}

  @Get()
  async getAggregatedData(@Query('period') period: string) {
    if (!['minute', 'hour', 'day'].includes(period)) {
      throw new BadRequestException(
        'Invalid period. Must be one of: minute, hour, day',
      );
    }

    return this.monitorService.getDataForPeriod(period);
  }
}
