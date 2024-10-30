import { Injectable } from '@nestjs/common';
import { io } from 'socket.io-client';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { SensorDataPost } from './interfaces/monitor.interface';
@Injectable()
export class MonitorService {
  constructor(private prisma: PrismaService) {}
  async sendData(sensorData: any) {
    const socket = io(process.env.API_URL);
    socket.emit('sensorData', sensorData);
  }
  async createSensorData(data: SensorDataPost) {
    return await this.prisma.sensorData.create({
      data: {
        latest: data.latest,
        elapsed: data.elapsed,
        localName: data.localName,
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        light_A: data.light_A,
        sol: data.sol,
        acc_x: data.acc_x,
        acc_y: data.acc_y,
        acc_z: data.acc_z,
        iaq: data.iaq,
        gyro_x: data.gyro_x,
        gyro_y: data.gyro_y,
        gyro_z: data.gyro_z,
        accuracy: data.accuracy,
        SeuilHumidity_min: data.SeuilHumidity_min,
        SeuilHumidity_max: data.SeuilHumidity_max,
        SeuilTemp_min: data.SeuilTemp_min,
        SeuilTemp_max: data.SeuilTemp_max,
        SeuilLum_min: data.SeuilLum_min,
        SeuilLum_max: data.SeuilLum_max,
        SeuilPression_min: data.SeuilPression_min,
        SeuilPression_max: data.SeuilPression_max,
        SeuilCo2_min: data.SeuilCo2_min,
        SeuilCo2_max: data.SeuilCo2_max,
        MeanTemp: data.MeanTemp,
        MeanHumidity: data.MeanHumidity,
        MeanLum: data.MeanLum,
        MeanPress: data.MeanPress,
        MeanCo2: data.MeanCo2,
        S1: data.S1,
        S2: data.S2,
        S3: data.S3,
        S4: data.S4,
        S5: data.S5,
        S6: data.S6,
        S7: data.S7,
        S8: data.S8,
        S9: data.S9,
        S10: data.S10,
        S11: data.S11,
        S12: data.S12,
        S13: data.S13,
        S14: data.S14,
        S15: data.S15,
        S16: data.S16,
        MomentFloraison: data.MomentFloraison,
      },
    });
  }

  async getAllSensorData() {
    const data = await this.prisma.sensorData.findMany();
    return this.convertBigIntToString(data);
  }
  convertBigIntToString(obj) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  }
}
