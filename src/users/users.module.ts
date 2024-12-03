import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { PrismaModule } from 'src/prismaModule/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
