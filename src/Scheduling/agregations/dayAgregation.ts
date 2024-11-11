import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prismaModule/prisma-service';

@Injectable()
export class DailyAggregationService {
  private readonly logger = new Logger(DailyAggregationService.name);
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyAggregation() {
    this.logger.warn('Daily aggregation cron job started...');
    await this.aggregateDailyData();
    console.log('Daily aggregation cron job finished.');
    this.logger.warn('Daily aggregation cron job finished.');
  }

  async aggregateDailyData() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Récupère toutes les agrégations par heure pour les dernières 24 heures
    const hourlyData = await this.prisma.sensorDataForHour.findMany({
      where: {
        timestamp: {
          gte: oneDayAgo.toISOString(),
        },
      },
    });

    if (hourlyData.length === 0) {
      console.log('Aucune donnée à agréger pour la dernière journée.');
      return;
    }

    // Définir les timestamps de début et de fin pour l'agrégation quotidienne
    const startTime = new Date(hourlyData[0].startTimestamp); // Earliest timestamp
    const endTime = new Date(hourlyData[hourlyData.length - 1].endTimestamp); // Latest timestamp

    // Calcul des moyennes quotidiennes pour chaque champ
    const averageTemp =
      hourlyData.reduce((sum, d) => sum + (d.averageTemp || 0), 0) /
      hourlyData.length;
    const averageHumidity =
      hourlyData.reduce((sum, d) => sum + (d.averageHumidity || 0), 0) /
      hourlyData.length;
    const averagePressure =
      hourlyData.reduce((sum, d) => sum + (d.averagePressure || 0), 0) /
      hourlyData.length;
    const averageLightA =
      hourlyData.reduce((sum, d) => sum + (d.averageLightA || 0), 0) /
      hourlyData.length;
    const averageSol =
      hourlyData.reduce((sum, d) => sum + (d.averageSol || 0), 0) /
      hourlyData.length;
    const averageAccX =
      hourlyData.reduce((sum, d) => sum + (d.averageAccX || 0), 0) /
      hourlyData.length;
    const averageAccY =
      hourlyData.reduce((sum, d) => sum + (d.averageAccY || 0), 0) /
      hourlyData.length;
    const averageAccZ =
      hourlyData.reduce((sum, d) => sum + (d.averageAccZ || 0), 0) /
      hourlyData.length;
    const averageIaq =
      hourlyData.reduce((sum, d) => sum + (d.averageIaq || 0), 0) /
      hourlyData.length;
    const averageGyroX =
      hourlyData.reduce((sum, d) => sum + (d.averageGyroX || 0), 0) /
      hourlyData.length;
    const averageGyroY =
      hourlyData.reduce((sum, d) => sum + (d.averageGyroY || 0), 0) /
      hourlyData.length;
    const averageGyroZ =
      hourlyData.reduce((sum, d) => sum + (d.averageGyroZ || 0), 0) /
      hourlyData.length;

    // Dernières valeurs pour les seuils et données d'état (S1 à S16)
    const lastEntry = hourlyData[hourlyData.length - 1];

    // Enregistrement de l'agrégation quotidienne
    await this.prisma.sensorDataForDay.create({
      data: {
        timestamp: new Date(),
        startTimestamp: startTime,
        endTimestamp: endTime,
        averageTemp,
        averageHumidity,
        averagePressure,
        averageLightA,
        averageSol,
        averageAccX,
        averageAccY,
        averageAccZ,
        averageIaq,
        averageGyroX,
        averageGyroY,
        averageGyroZ,
        lastSeuilHumidityMin: lastEntry.lastSeuilHumidityMin,
        lastSeuilHumidityMax: lastEntry.lastSeuilHumidityMax,
        lastSeuilTempMin: lastEntry.lastSeuilTempMin,
        lastSeuilTempMax: lastEntry.lastSeuilTempMax,
        lastSeuilLumMin: lastEntry.lastSeuilLumMin,
        lastSeuilLumMax: lastEntry.lastSeuilLumMax,
        lastSeuilPressionMin: lastEntry.lastSeuilPressionMin,
        lastSeuilPressionMax: lastEntry.lastSeuilPressionMax,
        lastSeuilCo2Min: lastEntry.lastSeuilCo2Min,
        lastSeuilCo2Max: lastEntry.lastSeuilCo2Max,
        lastMeanTemp: lastEntry.lastMeanTemp,
        lastMeanHumidity: lastEntry.lastMeanHumidity,
        lastMeanLum: lastEntry.lastMeanLum,
        lastMeanPress: lastEntry.lastMeanPress,
        lastMeanCo2: lastEntry.lastMeanCo2,
        S1: lastEntry.S1,
        S2: lastEntry.S2,
        S3: lastEntry.S3,
        S4: lastEntry.S4,
        S5: lastEntry.S5,
        S6: lastEntry.S6,
        S7: lastEntry.S7,
        S8: lastEntry.S8,
        S9: lastEntry.S9,
        S10: lastEntry.S10,
        S11: lastEntry.S11,
        S12: lastEntry.S12,
        S13: lastEntry.S13,
        S14: lastEntry.S14,
        S15: lastEntry.S15,
        S16: lastEntry.S16,
        MomentFloraison: lastEntry.MomentFloraison,
      },
    });
  }
}
