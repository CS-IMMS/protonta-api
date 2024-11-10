import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IMonitorData } from './core/utils/convertData';
import { ISensorDataPost } from './monitor/interfaces/monitor.interface';
import { MonitorCommandeDto, RestartDto } from './dto/app.dto';

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
  updateCommade(@Body() commande: MonitorCommandeDto) {
    return this.appService.sendCommande(commande);
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
