import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { AuthController } from './auth.cntroleur';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategies';
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, PrismaService],
})
export class AuthModule {}
