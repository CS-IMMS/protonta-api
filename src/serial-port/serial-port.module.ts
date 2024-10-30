import { Module } from '@nestjs/common';
import { SerialPortService } from './serial-port.service';
import { SerialPortController } from './serial-port.controller';

@Module({
  providers: [SerialPortService],
  controllers: [SerialPortController],
})
export class SerialPortModule {}
