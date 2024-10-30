import { Injectable } from '@nestjs/common';
import { io } from 'socket.io-client';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  send(): string {
    const socket = io('https://protonta-api.onrender.com');
    const sensorData = {
      latest: Date.now(),
      elapsed: 1000, // Temps écoulé en millisecondes
      localName: 's1',
      temperature: Math.random() * 30,
      humidity: Math.random() * 100,
      pressure: Math.random() * 1000,
      light_A: Math.random() * 100,
      sol: Math.random(),
      acc_x: Math.random(),
      acc_y: Math.random(),
      acc_z: Math.random(),
      iaq: Math.random() * 500,
      gyro_x: Math.random(),
      gyro_y: Math.random(),
      gyro_z: Math.random(),
      accuracy: Math.floor(Math.random() * 100),
      SeuilHumidity_min: 30,
      SeuilHumidity_max: 70,
      SeuilTemp_min: 15,
      SeuilTemp_max: 25,
      SeuilLum_min: 100,
      SeuilLum_max: 400,
      SeuilPression_min: 950,
      SeuilPression_max: 1050,
      SeuilCo2_min: 400,
      SeuilCo2_max: 1000,
      MeanTemp: Math.random() * 30,
      MeanHumidity: Math.random() * 100,
      MeanLum: Math.random() * 100,
      MeanPress: Math.random() * 1000,
      MeanCo2: Math.random() * 1000,
      S1: Math.round(Math.random()), // État de sortie
      S2: Math.round(Math.random()),
      S3: Math.round(Math.random()),
      S4: Math.round(Math.random()),
      S5: Math.round(Math.random()),
      S6: Math.round(Math.random()),
      S7: Math.round(Math.random()),
      S8: Math.round(Math.random()),
      S9: Math.round(Math.random()),
      S10: Math.round(Math.random()),
      S11: Math.round(Math.random()),
      S12: Math.round(Math.random()),
      S13: Math.round(Math.random()),
      S14: Math.round(Math.random()),
      S15: Math.round(Math.random()),
      S16: Math.round(Math.random()),
      MomentFloraison: Math.random() > 0.5,
    };
    socket.emit('sensorData', sensorData);
    socket.on('getCommands', (dataRecive) => {
      console.log('les comande:', dataRecive);
    });
    return 'data send';
  }
}
