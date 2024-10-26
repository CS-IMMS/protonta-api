import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService) {}

  @Get('')
  initConnection(): any {
    return this.monitorService.getAllSensorData();
  }
}
