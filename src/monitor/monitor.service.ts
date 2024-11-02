import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';
@Injectable()
export class MonitorService {
  constructor(private prisma: PrismaService) {}
  async getDataForPeriod(period: string) {
    const now = new Date();
    let startDate: Date;

    if (period === 'minute') {
      startDate = new Date(now.getTime() - 60 * 1000);
      return await this.minuteResource();
    } else if (period === 'hour') {
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
    } else if (period === 'day') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else {
      throw new Error('Invalid period');
    }
  }
  async minuteResource() {
    return await this.prisma.sensorDataForMinute.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}
