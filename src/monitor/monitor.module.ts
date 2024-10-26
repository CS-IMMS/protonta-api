import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prismaModule/prisma.module';
import { SensorGateway } from './monitor.gateway';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controler';

@Module({
  imports: [PrismaModule],
  controllers: [MonitorController],
  providers: [SensorGateway, MonitorService],
})
export class MonitorModule {}
