import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { DataBaseService } from './dataBase.service';

@Global()
@Module({
  providers: [PrismaService, DataBaseService],
  exports: [PrismaService, DataBaseService],
})
export class DataBaseModule {}
