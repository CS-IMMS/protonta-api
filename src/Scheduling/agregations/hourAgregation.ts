import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prismaModule/prisma-service';

@Injectable()
export class HourlyAggregationService {
  private readonly logger = new Logger(HourlyAggregationService.name);
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyAggregation() {
    this.logger.warn('Hourly aggregation cron job started...');
    await this.aggregateHourlyData();
    console.log('Hourly aggregation cron job finished.');
    this.logger.warn('Hourly aggregation cron job finished.');
  }

  async aggregateHourlyData() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Récupère toutes les agrégations par minute pour la dernière heure
    const minuteData = await this.prisma.sensorDataForMinute.findMany({
      where: {
        timestamp: {
          gte: oneHourAgo.toISOString(),
        },
      },
    });

    if (minuteData.length === 0) {
      console.log('Aucune donnée à agréger pour la dernière heure.');
      return;
    }

    // Définir les timestamps de début et de fin pour l'agrégation horaire
    const startTime = new Date(minuteData[0].startTimestamp); // Earliest timestamp
    const endTime = new Date(minuteData[minuteData.length - 1].endTimestamp); // Latest timestamp

    // Calcul des moyennes horaires pour chaque champ
    const averageTemp =
      minuteData.reduce((sum, d) => sum + (d.averageTemp || 0), 0) /
      minuteData.length;
    const averageHumidity =
      minuteData.reduce((sum, d) => sum + (d.averageHumidity || 0), 0) /
      minuteData.length;
    const averagePressure =
      minuteData.reduce((sum, d) => sum + (d.averagePressure || 0), 0) /
      minuteData.length;
    const averageLightA =
      minuteData.reduce((sum, d) => sum + (d.averageLightA || 0), 0) /
      minuteData.length;
    const averageSol =
      minuteData.reduce((sum, d) => sum + (d.averageSol || 0), 0) /
      minuteData.length;
    const averageAccX =
      minuteData.reduce((sum, d) => sum + (d.averageAccX || 0), 0) /
      minuteData.length;
    const averageAccY =
      minuteData.reduce((sum, d) => sum + (d.averageAccY || 0), 0) /
      minuteData.length;
    const averageAccZ =
      minuteData.reduce((sum, d) => sum + (d.averageAccZ || 0), 0) /
      minuteData.length;
    const averageIaq =
      minuteData.reduce((sum, d) => sum + (d.averageIaq || 0), 0) /
      minuteData.length;
    const averageGyroX =
      minuteData.reduce((sum, d) => sum + (d.averageGyroX || 0), 0) /
      minuteData.length;
    const averageGyroY =
      minuteData.reduce((sum, d) => sum + (d.averageGyroY || 0), 0) /
      minuteData.length;
    const averageGyroZ =
      minuteData.reduce((sum, d) => sum + (d.averageGyroZ || 0), 0) /
      minuteData.length;

    // Dernières valeurs pour les seuils et données d'état (S1 à S16)
    const lastEntry = minuteData[minuteData.length - 1];

    // Enregistrement de l'agrégation horaire
    await this.prisma.sensorDataForHour.create({
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
        momentFloraison: lastEntry.momentFloraison,
      },
    });
  }
}
