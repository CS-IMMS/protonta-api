import { Body, Controller, Post } from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService) {}

  @Post('/sendData')
  initConnection(@Body() data: any): any {
    return this.monitorService.sendData(data);
  }
}
