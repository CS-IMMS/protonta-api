import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IMonitorData } from './core/utils/convertData';
import { MonitorCommandeDto, RestartDto } from './dto/app.dto';
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

      // Vérifier si la commande est vide
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
