// import { Injectable } from '@nestjs/common';
// import { io } from 'socket.io-client';
// @Injectable()
// export class AppService {
//   getHello(): string {
//     return 'Hello World!';
//   }
//   send(): string {
//     const socket = io('https://protonta-api.onrender.com');
//     const sensorData = {
//       latest: Date.now(),
//       elapsed: 1000, // Temps écoulé en millisecondes
//       localName: 's1',
//       temperature: Math.random() * 30,
//       humidity: Math.random() * 100,
//       pressure: Math.random() * 1000,
//       light_A: Math.random() * 100,
//       sol: Math.random(),
//       acc_x: Math.random(),
//       acc_y: Math.random(),
//       acc_z: Math.random(),
//       iaq: Math.random() * 500,
//       gyro_x: Math.random(),
//       gyro_y: Math.random(),
//       gyro_z: Math.random(),
//       accuracy: Math.floor(Math.random() * 100),
//       SeuilHumidity_min: 30,
//       SeuilHumidity_max: 70,
//       SeuilTemp_min: 15,
//       SeuilTemp_max: 25,
//       SeuilLum_min: 100,
//       SeuilLum_max: 400,
//       SeuilPression_min: 950,
//       SeuilPression_max: 1050,
//       SeuilCo2_min: 400,
//       SeuilCo2_max: 1000,
//       MeanTemp: Math.random() * 30,
//       MeanHumidity: Math.random() * 100,
//       MeanLum: Math.random() * 100,
//       MeanPress: Math.random() * 1000,
//       MeanCo2: Math.random() * 1000,
//       S1: Math.round(Math.random()), // État de sortie
//       S2: Math.round(Math.random()),
//       S3: Math.round(Math.random()),
//       S4: Math.round(Math.random()),
//       S5: Math.round(Math.random()),
//       S6: Math.round(Math.random()),
//       S7: Math.round(Math.random()),
//       S8: Math.round(Math.random()),
//       S9: Math.round(Math.random()),
//       S10: Math.round(Math.random()),
//       S11: Math.round(Math.random()),
//       S12: Math.round(Math.random()),
//       S13: Math.round(Math.random()),
//       S14: Math.round(Math.random()),
//       S15: Math.round(Math.random()),
//       S16: Math.round(Math.random()),
//       MomentFloraison: Math.random() > 0.5,
//     };
//     socket.emit('sensorData', sensorData);
//     socket.on('getCommands', (dataRecive) => {
//       console.log('les comande:', dataRecive);
//     });
//     return 'data send';
//   }
// }
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { SerialPort } from 'serialport';
import { DataBaseService } from './core/shared/dataBase/dataBase.service';
import {
  convertBufferData,
  IMonitorData,
  parseSensorData,
} from './core/utils/convertData';
import { ISensorDataPost } from './monitor/interfaces/monitor.interface';
import { PrismaService } from './prismaModule/prisma-service';
import { SocketGateway } from './socket/socket.service';

@Injectable()
export class AppService implements OnModuleInit {
  private port: SerialPort;
  constructor(
    private dataBaseService: DataBaseService,
    private socketGateway: SocketGateway,
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {}
  async onModuleInit() {
    const portPath = await this.findSerialPort();
    this.logger.info('portPath:::', portPath);
    if (portPath) {
      this.initializeSerialPort(portPath);
    } else {
      console.error('Aucun port USB disponible trouvé.');
    }
  }
  async healthCheck() {
    return 'hello world';
  }
  async simulator(data: IMonitorData): Promise<ISensorDataPost> {
    let dataConvert = '';
    let dataParse!: ISensorDataPost;
    if (data) {
      dataConvert = convertBufferData(data);
      dataParse = parseSensorData(dataConvert);
    }
    return dataParse;
  }
  private async findSerialPort(): Promise<string | null> {
    const ports = await SerialPort.list();
    const usbPort = ports.find(
      (port) =>
        port.path.includes('ttyUSB') ||
        port.path.includes('ttyACM') ||
        port.path.includes('001'),
    );

    if (usbPort) {
      console.log(`Port USB trouvé : ${usbPort.path}`);
      this.logger.info(`Port USB trouvé : ${usbPort.path}`);
      return usbPort.path;
    } else {
      return null;
    }
  }

  private initializeSerialPort(portPath: string) {
    this.port = new SerialPort({
      path: portPath,
      baudRate: 115200,
    });

    this.port.on('data', async (data: any) => {
      let buffer = '';
      // try {
      //   console.log('data recive...............', data);

      //   this.logger.info('curent data:::', data);
      //   // Convertir et parser les données reçues
      //   const dataConvert = convertBufferData(data);
      //   console.log('data converte', dataConvert);

      //   const dataParse: ISensorDataPost = parseSensorData(dataConvert);
      //   console.log('data recive:::::', dataParse);

      //   // Sauvegarder les données dans la base de données
      //   await this.prisma.sensorDatas.create({
      //     data: dataParse,
      //   });

      //   // Envoyer les données aux clients via WebSocket
      //   this.socketGateway.sendSensorData(dataParse);
      // }
      try {
        buffer += data.toString();

        if (buffer.includes('\n')) {
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            console.log('data received:', line);
            const dataParse: ISensorDataPost = parseSensorData(line.trim());
            console.log('parsed data:', dataParse);
            await this.prisma.sensorDatas.create({
              data: dataParse,
            });
            this.socketGateway.sendSensorData(dataParse);
          }
        }
      } catch (error) {
        console.error(
          'Erreur lors du traitement des données du port série:',
          error,
        );
      }
    });

    // Gestion des erreurs
    this.port.on('error', (err) => {
      console.error('Erreur du port série:', err.message);
    });
  }
}
