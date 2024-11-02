import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';
@Injectable()
export class MonitorService {
  constructor(private prisma: PrismaService) {}
}
