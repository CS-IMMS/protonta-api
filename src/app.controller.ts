import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ComamandeToMonitor } from '@prisma/client';
import { AppService } from './app.service';
import { IMonitorData, LogValueType } from './core/utils/convertData';
import { MonitorCommandeDto, NotificationDto, RestartDto } from './dto/app.dto';
import { ISensorDataPost } from './monitor/interfaces/monitor.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() data: IMonitorData): Promise<ISensorDataPost> {
    return this.appService.simulator(data);
  }
  @Get()
  getHellos(): Promise<string> {
    return this.appService.healthCheck();
  }
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Le numéro de la page à récupérer',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Le nombre d’éléments par page',
    required: false,
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Retourne les notifications paginées',
    schema: {
      type: 'object',
      properties: {
        // data: NotificationDto[],
        total: { type: 'number', example: 1000 },
        page: { type: 'number', example: 1 },
        pages: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide (paramètres incorrects)',
  })
  @Get('/notifications')
  async getNotifications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
  ): Promise<{
    data: NotificationDto[];
    total: number;
    page: number;
    pages: number;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 100;

    return this.appService.getNotifications(pageNumber, limitNumber);
  }
  @Get('/logs')
  @ApiOperation({ summary: 'Retrieve logs with optional filters' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description:
      'The start date for filtering logs (ISO format, e.g., 2024-11-01)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description:
      'The end date for filtering logs (ISO format, e.g., 2024-11-10)',
  })
  @ApiQuery({
    name: 'field',
    required: false,
    type: String,
    description: 'The field to filter logs by (e.g., S1, S2, etc.)',
  })
  @ApiQuery({
    name: 'value',
    required: false,
    type: String,
    enum: ['active', 'inactive', 'true', 'false', 'reactor', 0, 1],
    description: 'The value to filter the specified field by',
  })
  @ApiBadRequestResponse({
    description: 'Invalid field provided',
  })
  gatLogs(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('field') field?: string,
    @Query('value') value?: LogValueType,
  ): Promise<ComamandeToMonitor[]> {
    if (field && !this.isValidField(field)) {
      throw new BadRequestException(`Invalid field: ${field}`);
    }
    return this.appService.gatLogs({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      field,
      value,
    });
  }
  private isValidField(field: string): boolean {
    const validFields = [
      'S1',
      'S2',
      'S3',
      'S4',
      'S5',
      'S6',
      'S7',
      'S8',
      'S9',
      'S10',
      'S11',
      'S12',
      'S13',
      'S14',
      'S15',
      'S16',
      'HumMin',
      'HumMax',
      'TemMin',
      'TemMax',
      'LumMin',
      'LumMax',
      'PressMin',
      'PressMax',
      'Co2Min',
      'Co2Max',
      'param300',
      'param301',
      'param302',
      'param303',
      'param304',
      'param305',
      'param306',
      'param307',
      'param308',
      'param309',
      'param310',
      'param311',
      'param313',
      'param314',
      'param315',
      'param316',
      'PolStartTime',
      'PolEndTime',
      'Periode',
      'MomentFloraison',
    ];
    return validFields.includes(field);
  }
  @Post('monitor-restart')
  protendataRestart(@Body() restartDto: RestartDto) {
    return this.appService.resatartService(restartDto);
  }
  @Post('send-commande')
  async updateCommade(@Body() commande: MonitorCommandeDto) {
    try {
      console.log(
        'Nombre de clés dans la commande:',
        Object.keys(commande).length,
      );

      if (Object.keys(commande).length === 0) {
        throw new BadRequestException('Aucune commande passée.');
      }
      return await this.appService.sendCommande(commande);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
    }
  }
  // @Get('/test')
  // getHellofffff(): string {
  //   return this.appService.getHello();
  // }
  // @Get('/send')
  // send(): string {
  //   return this.appService.send();
  // }
}
