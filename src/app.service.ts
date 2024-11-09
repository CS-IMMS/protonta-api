import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { ReadlineParser, SerialPort } from 'serialport';
import { DataBaseService } from './core/shared/dataBase/dataBase.service';
import {
  convertBufferData,
  IMonitorData,
  parseSensorData,
} from './core/utils/convertData';
import { RestartDto } from './dto/app.dto';
import { ISensorDataPost } from './monitor/interfaces/monitor.interface';
import { PrismaService } from './prismaModule/prisma-service';
import { SocketGateway } from './socket/socket.service';

@Injectable()
export class AppService implements OnModuleInit {
  private port: SerialPort;
  private lastDataReceivedTime: number | null = null;
  private inactivityTimeout: number = 5000;
  private inactivityCheckInterval: NodeJS.Timeout | null = null;
  private portPath!: string;
  constructor(
    private dataBaseService: DataBaseService,
    private socketGateway: SocketGateway,
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {}
  async onModuleInit() {
    this.portPath = await this.findSerialPort();
    this.logger.info('portPath:::', this.portPath);
    if (this.portPath) {
      this.initializeSerialPort(this.portPath);
    } else {
      console.error('Aucun port USB disponible trouvé.');
      this.socketGateway.notification(NotificationType.Moniteur, 'inactive');
    }
  }
  async healthCheck() {
    return 'hello world';
  }
  async resatartService(data: RestartDto) {
    if (data.status === true) {
      this.initializeSerialPort(this.portPath);
    }
    return { message: 'service restart' };
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
  sendSensorNotifications(sensorData: ISensorDataPost) {
    const alerts = {
      a1: { type: 'Bipeure', message: 'Bipeur Allumé' },
      a2: { type: 'Ombriere', message: 'Ombrière déployée' },
      a3: { type: 'Ombriere', message: 'Ombrière rétractée' },
      a4: { type: 'SAS', message: 'SAS porte 1 ouverte' },
      a5: { type: 'SAS', message: 'SAS porte 2 ouverte' },
      a6: { type: 'Chateau', message: "Niveau Bas Chateau d'eau Pad Cooling" },
      a7: { type: 'Chateau', message: "Niveau Bas Chateau d'eau Irrigation" },
      a8: { type: 'Chateau', message: "Niveau Bas Chateau d'eau Aéroponie" },
      a9: { type: 'Chateau', message: "Niveau Bas Chateau d'eau Hydroponie" },
      a10: { type: 'Chateau', message: 'Niveau Bas Chateau d’eau Fertilisée' },
    };

    Object.keys(alerts).forEach((key) => {
      if (sensorData[key] === 1) {
        const alert = alerts[key];
        this.socketGateway.notification(
          alert.type as NotificationType,
          alert.message,
        );
      }
    });
  }

  private initializeSerialPort(portPath: string) {
    this.port = new SerialPort({
      path: portPath,
      baudRate: 115200,
    });
    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));
    parser.on('data', async (data: any) => {
      try {
        if (data) {
          this.lastDataReceivedTime = Date.now();
          // this.socketGateway.notification(ProtentaStatusEnum.active);
          const dataParse: ISensorDataPost = parseSensorData(data.trim());
          console.log('Parsed data:', dataParse);
          this.socketGateway.sendSensorData(dataParse);
          await this.prisma.sensorDatas.create({ data: dataParse });
          this.sendSensorNotifications(dataParse);
          this.restartInactivityCheck();
        } else {
          this.checkInactivity();
        }
      } catch (error) {
        console.error(
          'Erreur lors du traitement des données du port série:',
          error,
        );
      }
    });
    this.port.on('close', () => {
      console.log('Port série fermé');
      this.stopInactivityCheck();
      this.socketGateway.notification(NotificationType.Moniteur, 'inactive');
    });
    // Gestion des erreurs
    this.port.on('error', (err) => {
      console.error('Erreur du port série:', err.message);
    });

    this.startInactivityCheck();
  }
  private startInactivityCheck() {
    if (!this.inactivityCheckInterval) {
      this.inactivityCheckInterval = setInterval(
        () => this.checkInactivity(),
        5000,
      );
    }
  }
  private restartInactivityCheck() {
    this.stopInactivityCheck();
    this.startInactivityCheck();
  }
  private stopInactivityCheck() {
    if (this.inactivityCheckInterval) {
      clearInterval(this.inactivityCheckInterval);
      this.inactivityCheckInterval = null;
    }
  }
  checkInactivity() {
    this.socketGateway.notification(NotificationType.Moniteur, 'inactive');
  }
}
