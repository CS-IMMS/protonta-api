import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MonitorService } from './monitor.service';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService) {}
  @ApiOperation({
    summary: 'Récupère les données agrégées pour une période donnée',
    description:
      'Ce end-point permet de récupérer des données de capteurs agrégées pour une période spécifiée : minute, heure ou jour.',
  })
  @ApiQuery({
    name: 'period',
    required: true,
    description:
      'La période pour laquelle récupérer les données agrégées (minute, hour, day)',
    enum: ['minute', 'hour', 'day'],
  })
  @Get()
  async getAggregatedData(@Query('period') period: string) {
    if (!['minute', 'hour', 'day'].includes(period)) {
      throw new BadRequestException(
        'Invalid period. Must be one of: minute, hour, day',
      );
    }

    return this.monitorService.getDataForPeriod(period);
  }
  @Get('range')
  @ApiOperation({
    summary: 'Récupère les données agrégées pour une plage de dates',
    description:
      'Ce end-point permet de récupérer des données agrégées de capteurs entre deux dates spécifiées.',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'La date de début de la période (format: YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'La date de fin de la période (format: YYYY-MM-DD)',
  })
  async getAggregatedDataForDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Use YYYY-MM-DD for both startDate and endDate.',
      );
    }

    return this.monitorService.getDataForDateRange(start, end);
  }
}
