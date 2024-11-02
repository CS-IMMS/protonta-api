import { Global, Module } from '@nestjs/common';
import { DataBaseService } from './dataBase.service';
import { PrismaService } from './prisma-service';

@Global()
@Module({
  providers: [PrismaService, DataBaseService],
  exports: [PrismaService, DataBaseService],
})
export class PrismaModule {}
