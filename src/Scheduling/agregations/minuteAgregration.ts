import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prismaModule/prisma-service';

@Injectable()
export class MinuteAggregationService {
  private readonly logger = new Logger(MinuteAggregationService.name);
  constructor(private prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_MINUTE)
  async handleMinuteAggregation() {
    this.logger.warn('Aggregation cron job started...');
    await this.aggregateMinuteData();
    console.log('Aggregation cron job finished.');
    this.logger.warn('Aggregation cron job finished.');
  }
  async aggregateMinuteData() {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const data = await this.prisma.sensorDatas.findMany({
      where: {
        timestamp: {
          gte: oneMinuteAgo.toISOString(),
        },
      },
    });

    if (data.length === 0) {
      console.log('Aucune donnée à agréger pour la dernière minute.');
      return;
    }

    // Définir les timestamps de début et de fin pour l'agrégation
    const startTime = new Date(data[0].timestamp); // Earliest timestamp
    const endTime = new Date(data[data.length - 1].timestamp); // Latest timestamp

    // Calculer les moyennes pour les champs numériques
    const averageTemp =
      data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
    const averageHumidity =
      data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
    const averagePressure =
      data.reduce((sum, d) => sum + d.pressure, 0) / data.length;
    const averageLightA =
      data.reduce((sum, d) => sum + d.light_A, 0) / data.length;
    const averageSol = data.reduce((sum, d) => sum + d.sol, 0) / data.length;
    const averageAccX = data.reduce((sum, d) => sum + d.acc_x, 0) / data.length;
    const averageAccY = data.reduce((sum, d) => sum + d.acc_y, 0) / data.length;
    const averageAccZ = data.reduce((sum, d) => sum + d.acc_z, 0) / data.length;
    const averageIaq = data.reduce((sum, d) => sum + d.iaq, 0) / data.length;
    const averageGyroX =
      data.reduce((sum, d) => sum + d.gyro_x, 0) / data.length;
    const averageGyroY =
      data.reduce((sum, d) => sum + d.gyro_y, 0) / data.length;
    const averageGyroZ =
      data.reduce((sum, d) => sum + d.gyro_z, 0) / data.length;
    console.log('test', averageTemp);

    // Calculer les pourcentages d'état actif/inactif pour S1 à S16
    const calculateDominantValue = (field: keyof (typeof data)[0]): number => {
      const countOf1 = data.filter((d) => d[field] === 1).length;
      const countOf0 = data.length - countOf1;
      return countOf1 > countOf0 ? 1 : 0;
    };

    const S1 = calculateDominantValue('S1');
    const S2 = calculateDominantValue('S2');
    const S3 = calculateDominantValue('S3');
    const S4 = calculateDominantValue('S4');
    const S5 = calculateDominantValue('S5');
    const S6 = calculateDominantValue('S6');
    const S7 = calculateDominantValue('S7');
    const S8 = calculateDominantValue('S8');
    const S9 = calculateDominantValue('S9');
    const S10 = calculateDominantValue('S10');
    const S11 = calculateDominantValue('S11');
    const S12 = calculateDominantValue('S12');
    const S13 = calculateDominantValue('S13');
    const S14 = calculateDominantValue('S14');
    const S15 = calculateDominantValue('S15');
    const S16 = calculateDominantValue('S16');

    // Calculer la majorité de `MomentFloraison`
    const trueCount = data.filter((d) => d.MomentFloraison === true).length;
    const momentFloraison = trueCount > data.length / 2;
    //calcul des seuil
    const lastDataEntry = data.find(
      (entry) => entry.timestamp.getSeconds() === endTime.getSeconds(),
    );
    console.log('lastDataEntry:::::', lastDataEntry);

    const {
      SeuilHumidity_min: SeuilHumidity_min,
      SeuilHumidity_max: SeuilHumidity_max,
      SeuilTemp_min: SeuilTemp_min,
      SeuilTemp_max: SeuilTemp_max,
      SeuilLum_min: SeuilLum_min,
      SeuilLum_max: SeuilLum_max,
      SeuilPression_min: SeuilPression_min,
      SeuilPression_max: SeuilPression_max,
      SeuilCo2_min: SeuilCo2_min,
      SeuilCo2_max: SeuilCo2_max,
      MeanTemp: MeanTemp,
      MeanHumidity: MeanHumidity,
      MeanLum: MeanLum,
      MeanPress: MeanPress,
      MeanCo2: MeanCo2,
    } = lastDataEntry || data[0];
    // Enregistrer les données agrégées dans `SensorDataForMinute`
    await this.prisma.sensorDataForMinute.create({
      data: {
        timestamp: new Date(),
        startTimestamp: startTime,
        endTimestamp: endTime,
        averageTemp: averageTemp,
        averageHumidity: averageHumidity,
        averagePressure: averagePressure,
        averageLightA,
        averageSol,
        averageAccX,
        averageAccY,
        averageAccZ,
        averageIaq,
        averageGyroX,
        averageGyroY,
        averageGyroZ,
        lastSeuilTempMax: SeuilTemp_max,
        lastSeuilTempMin: SeuilTemp_min,
        lastSeuilHumidityMin: SeuilHumidity_min,
        lastSeuilHumidityMax: SeuilHumidity_max,
        lastSeuilLumMin: SeuilLum_min,
        lastSeuilLumMax: SeuilLum_max,
        lastSeuilPressionMin: SeuilPression_min,
        lastSeuilPressionMax: SeuilPression_max,
        lastSeuilCo2Min: SeuilCo2_min,
        lastSeuilCo2Max: SeuilCo2_max,
        lastMeanTemp: MeanTemp,
        lastMeanHumidity: MeanHumidity,
        lastMeanLum: MeanLum,
        lastMeanPress: MeanPress,
        lastMeanCo2: MeanCo2,
        S1,
        S2,
        S3,
        S4,
        S5,
        S6,
        S7,
        S8,
        S9,
        S10,
        S11,
        S12,
        S13,
        S14,
        S15,
        S16,
        MomentFloraison: momentFloraison,
      },
    });
  }
}
