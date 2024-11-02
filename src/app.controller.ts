import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IMonitorData } from './core/utils/convertData';
import { ISensorDataPost } from './monitor/interfaces/monitor.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() data: IMonitorData): Promise<ISensorDataPost> {
    return this.appService.simulator(data);
  }
  @Get()
  getHellos(@Body() data: IMonitorData): Promise<ISensorDataPost> {
    return this.appService.simulator(data);
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
