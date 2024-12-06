import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { AddCultureDto, AddSerreDto } from './dto/monitor.dto';
import { MonitorType } from './interfaces/monitor.interface';

@Injectable()
export class MonitorService {
  constructor(private prisma: PrismaService) {}
  async getLatestSensorData(dataType: MonitorType) {
    const data = await this.prisma.sensorDatas.findMany({
      where: {
        ...(dataType === 'capteur'
          ? { localName: { not: null } }
          : {
              AND: [
                { MeanTemp: { not: null } },
                { MeanHumidity: { not: null } },
                { MeanLum: { not: null } },
                { MeanPress: { not: null } },
                { MeanCo2: { not: null } },
                { S1: { not: null } },
              ],
            }),
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 1,
    });
    return data[0];
  }
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
        `No data found for the period from ${start.toISOString()} to ${end.toISOString()}`,
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
  async addSerre(userId: string, addSerreDto: AddSerreDto) {
    try {
      return await this.prisma.serre.create({
        data: {
          serreId: addSerreDto.serreId,
          users: {
            connect: {
              id: userId,
            },
          },
          sensorDatasId: addSerreDto.serreId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'A greenhouse with this identifier already exists',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('The specified user does not exist');
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the greenhouse',
      );
    }
  }
  async addCulture(userId: string, cultureDto: AddCultureDto, serreId: string) {
    try {
      const checkIfSerreExit = await this.prisma.serre.findUnique({
        where: {
          id: serreId,
        },
      });
      console.log(checkIfSerreExit);

      if (!checkIfSerreExit) {
        throw new NotFoundException('Greenhouse not found');
      }
      const {
        name,
        variety,
        type,
        description,
        startProduction,
        estimationDate,
      } = cultureDto;

      return await this.prisma.cultureInfos.create({
        data: {
          name,
          variety,
          type,
          description,
          startProduction,
          endProduction: new Date(
            new Date(startProduction).getTime() +
              estimationDate * 24 * 60 * 60 * 1000,
          ).toISOString(),
          productionIsEnded: false,
          Serre: {
            connect: {
              id: checkIfSerreExit.id,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'A culture with this identifier already exists',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'The initial configuration or specified greenhouse does not exist',
        );
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the culture',
      );
    }
  }
  async getAllSerres() {
    return this.prisma.serre.findMany({
      include: {
        _count: true,
        allCulture: true,
        users: {
          select: {
            firstName: true,
            lastName: true,
            userName: true,
            phoneNumber: true,
          },
        },
      },
    });
  }
}
