import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';

@Injectable()
export class MinuteAggregationService {
  constructor(private prisma: PrismaService) {}

  async aggregateMinuteData() {
    const data = await this.prisma.sensorData.findMany({
      where: {
        /* conditions to get last minute data */
      },
    });
    // Set startTime and endTime
    const startTime = new Date(data[0].latest); // Earliest timestamp
    const endTime = new Date(data[data.length - 1].latest); // Latest timestamp
    const averageTemp =
      data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
    const averageHumidity =
      data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
    // Calculate other averages...

    // Calculate active/inactive averages for S1 through S16
    const calculateStateAverage = (field: keyof (typeof data)[0]) => {
      const activeCount = data.filter((d) => d[field] === 1).length;
      const inactiveCount = data.length - activeCount;
      return [activeCount / data.length, inactiveCount / data.length];
    };

    const S1 = calculateStateAverage('S1');
    const S2 = calculateStateAverage('S2');
    // Repeat for S3 through S16...
    const trueCount = data.filter((d) => d.MomentFloraison === true).length;
    const MomentFloraison = trueCount > data.length / 2;

    // await this.prisma.sensorDataMinute.create({
    //   data: {
    //     averageTemp,
    //     averageHumidity,
    //     // other averages...
    //     S1,
    //     S2,
    //     // other state arrays for S3-S16...
    //   },
    // });
  }
}
