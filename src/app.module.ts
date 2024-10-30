import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorModule } from './monitor/monitor.module';
import { SerialPortModule } from './serial-port/serial-port.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MonitorModule,
    SerialPortModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
