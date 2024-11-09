import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';

@Injectable()
export class MonitorService {
  constructor(private prisma: PrismaService) {}

  async getDataForPeriod(period: string) {
    if (period === 'minute') {
      return await this.getMinuteData();
    } else if (period === 'hour') {
      return await this.getHourlyData();
    } else if (period === 'day') {
      return await this.getDailyData();
    } else {
      throw new Error('Invalid period');
    }
  }
  async getDataForDateRange(start: Date, end: Date) {
    const data = await this.prisma.sensorDataForDay.findMany({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    if (data.length === 0) {
      throw new NotFoundException(
        `Aucune donnée trouvée pour la période du ${start.toISOString()} au ${end.toISOString()}`,
      );
    }

    return data;
  }
  // Récupération des données agrégées par minute
  async getMinuteData() {
    return await this.prisma.sensorDataForMinute.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  // Récupération des données agrégées par heure
  async getHourlyData() {
    return await this.prisma.sensorDataForHour.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  // Récupération des données agrégées par jour
  async getDailyData() {
    return await this.prisma.sensorDataForDay.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}
