import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { DailyAggregationService } from './Scheduling/agregations/dayAgregation';
import { HourlyAggregationService } from './Scheduling/agregations/hourAgregation';
import { MinuteAggregationService } from './Scheduling/agregations/minuteAgregration';
import { DataGeneratorService } from './Scheduling/crons-jobs/dataSulator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from './core/shared/dataBase/dataBase.module';
import { DataBaseService } from './core/shared/dataBase/dataBase.service';
import { MonitorModule } from './monitor/monitor.module';
import { PrismaService } from './prismaModule/prisma-service';
import { SocketGateway } from './socket/socket.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true,
            ignore: 'pid,hostname', // Supprime des infos moins utiles pour le dev
          },
        },
      },
    }),
    MonitorModule,
    DataBaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SocketGateway,
    DataGeneratorService,
    PrismaService,
    DataBaseService,
    MinuteAggregationService,
    HourlyAggregationService,
    DailyAggregationService,
  ],
})
export class AppModule {}
