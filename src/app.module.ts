import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { DailyAggregationService } from './Scheduling/agregations/dayAgregation';
import { HourlyAggregationService } from './Scheduling/agregations/hourAgregation';
import { MinuteAggregationService } from './Scheduling/agregations/minuteAgregration';
import { UsersModule } from './users/users.module';
// import { DataGeneratorService } from './Scheduling/crons-jobs/dataSulator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataBaseModule } from './core/shared/dataBase/dataBase.module';
import { DataBaseService } from './core/shared/dataBase/dataBase.service';
import { MonitorModule } from './monitor/monitor.module';
import { PrismaService } from './prismaModule/prisma-service';
import { RoleModule } from './roles/role.module';
import { SocketGateway } from './socket/socket.service';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    MonitorModule,
    DataBaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SocketGateway,
    // DataGeneratorService,
    PrismaService,
    DataBaseService,
    MinuteAggregationService,
    HourlyAggregationService,
    DailyAggregationService,
    RoleModule,
  ],
})
export class AppModule {}
