// role.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { RolesGuard } from '../roles/roles.guard';

@Module({
  providers: [PrismaService, RolesGuard],
  exports: [],
})
export class RoleModule {}
