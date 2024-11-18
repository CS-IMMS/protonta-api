import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { ReadlineParser, SerialPort } from 'serialport';
import { DataBaseService } from './core/shared/dataBase/dataBase.service';
import {
  convertBufferData,
  IMonitorData,
  LogValueType,
  parseSensorData,
} from './core/utils/convertData';
import { MonitorCommandeDto, RestartDto } from './dto/app.dto';
import { sensorCodes, sensorManualAutoCodes } from './dto/utils';
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
      this.socketGateway.notification(NotificationType.Moniteur, 'inactif');
    }
  }
  async healthCheck() {
    return 'hello world';
  }
  async getNotifications() {
    const getAllNotifications = await this.prisma.notification.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });
    return getAllNotifications;
  }
  async gatLogs(filter: {
    startDate?: Date;
    endDate?: Date;
    field?: string;
    value?: LogValueType;
  }) {
    const { startDate, endDate, field, value } = filter;
    const conditions: any = {};

    if (startDate || endDate) {
      conditions.timestamp = {};
      if (startDate) conditions.timestamp.gte = startDate;
      if (endDate) conditions.timestamp.lte = endDate;
    }

    if (field && value) {
      conditions[field] = value;
    }

    if (Object.keys(conditions).length === 0) {
      return this.prisma.comamandeToMonitor.findMany();
    }

    return this.prisma.comamandeToMonitor.findMany({
      // where: conditions,
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
  async saveCommande(commande: MonitorCommandeDto) {
    return await this.prisma.comamandeToMonitor.create({
      data: {
        S1: commande.S1 ?? null,
        S2: commande.S2 ?? null,
        S3: commande.S3 ?? null,
        S4: commande.S4 ?? null,
        S5: commande.S5 ?? null,
        S6: commande.S6 ?? null,
        S7: commande.S7 ?? null,
        S8: commande.S8 ?? null,
        S9: commande.S9 ?? null,
        S10: commande.S10 ?? null,
        S11: commande.S11 ?? null,
        S12: commande.S12 ?? null,
        S13: commande.S13 ?? null,
        S14: commande.S14 ?? null,
        S15: commande.S15 ?? null,
        S16: commande.S16 ?? null,
        HumMin: commande.HumMin ?? null,
        HumMax: commande.HumMax ?? null,
        TemMin: commande.TemMin ?? null,
        TemMax: commande.TemMax ?? null,
        LumMin: commande.LumMin ?? null,
        LumMax: commande.LumMax ?? null,
        PressMin: commande.PressMin ?? null,
        PressMax: commande.PressMax ?? null,
        Co2Min: commande.Co2Min ?? null,
        Co2Max: commande.Co2Max ?? null,
        param300: commande.param300 ?? null,
        param301: commande.param301 ?? null,
        param302: commande.param300 ?? null,
        param303: commande.param300 ?? null,
        param304: commande.param300 ?? null,
        param305: commande.param300 ?? null,
        param306: commande.param300 ?? null,
        param307: commande.param300 ?? null,
        param308: commande.param300 ?? null,
        param309: commande.param300 ?? null,
        param310: commande.param300 ?? null,
        param311: commande.param300 ?? null,
        param312: commande.param300 ?? null,
        param313: commande.param300 ?? null,
        param314: commande.param300 ?? null,
        param315: commande.param300 ?? null,
        param316: commande.param300 ?? null,
        PolStartTime: commande.PolStartTime ?? null,
        PolEndTime: commande.PolEndTime ?? null,
        Periode: commande.Periode ?? null,
        MomentFloraison:
          commande.MomentFloraison === 1
            ? true
            : commande.MomentFloraison === 0
              ? false
              : null,
      },
    });
  }
  async sendCommande(commande: MonitorCommandeDto) {
    try {
      // Transformation et envoi de la commande
      const newCommande = await this.processToTransformData(commande);
      await this.sendDataToProtenta(newCommande)
        .then(async () => {
          await this.saveCommande(commande);
          return { message: 'Commande envoyée', commande: newCommande };
        })
        .catch((e) => {
          console.log('erreur renvoyer par la protenta::::', e);
        });
    } catch (error) {
      console.error('Erreur lors de l’envoi de la commande:', error);
      throw new BadRequestException("Erreur lors de l'envoi de la commande.");
    }
  }

  // Fonction utilitaire pour vérifier si une des clés est présente
  private isAnyFieldPresent(
    commande: MonitorCommandeDto,
    fields: string[],
  ): boolean {
    return fields.some(
      (field) => commande[field] !== undefined && commande[field] !== null,
    );
  }

  private applyDefaultValues(
    commande: MonitorCommandeDto,
    defaults: Record<string, any>,
  ) {
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (commande[key] === undefined || commande[key] === null) {
        commande[key] = defaultValue;
      }
    }
  }

  async processToTransformData(commande: MonitorCommandeDto) {
    let response = '';

    // Traiter les états des capteurs S1 à S15
    Object.entries(sensorCodes).forEach(([key, codes]) => {
      console.log(commande[key]);

      if (commande[key] !== undefined) {
        const action = commande[key].toLowerCase();
        if (key === 'S12') {
          if (commande[key] === 'Deploy') {
            response += `220\n`;
          } else if (commande[key] === 'Reactor') {
            response += `221\n`;
          } else if (commande[key] === 'Arreter') {
            response += `222\n`;
          }
        } else if (codes[action] !== undefined) {
          response += `${codes[action]}\n`;
          console.log('code commande:::::', response);
        }
      }
    });

    const thresholds = [
      commande.HumMin,
      commande.HumMax,
      commande.TemMin,
      commande.TemMax,
      commande.LumMin,
      commande.LumMax,
      commande.PressMin,
      commande.PressMax,
      commande.Co2Min,
      commande.Co2Max,
    ]
      .filter((value) => value !== undefined)
      .join(',');

    if (thresholds) {
      response += `126,${thresholds}\n`;
    }

    const pollinationParams = [
      commande.PolStartTime ? new Date(commande.PolStartTime).getTime() : 0,
      commande.PolEndTime ? new Date(commande.PolEndTime).getTime() : 0,
      commande.Periode ? commande.Periode * 60 * 1000 : 0,
      commande.MomentFloraison ? commande.MomentFloraison : 0,
    ]
      .filter((value) => value !== 0)
      .join(',');

    if (pollinationParams) {
      response += `127,${pollinationParams}\n`;
    }

    // Traiter les codes manuelAuto
    Object.entries(sensorManualAutoCodes).forEach(([key, code]) => {
      if (commande[`param${code}`] === true) {
        // Vérifie que le paramètre est défini et actif
        response += `${code}\n`;
      }
    });

    return response;
  }

  async resatartService(data: RestartDto) {
    if (data.status === true) {
      this.initializeSerialPort(this.portPath);
    }
    this.socketGateway.notification(NotificationType.Moniteur, 'reactiver');
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
  private async sendDataToProtenta(commande: string) {
    try {
      console.log(
        "Début d'envoi de la commande:",
        commande,
        'à',
        new Date().toISOString(),
      );

      if (this.port.isOpen) {
        // const dataString = JSON.stringify(commande);

        // this.port.flush();

        await new Promise<void>((resolve, reject) => {
          this.port.write(commande + '\n', (err) => {
            if (err) {
              console.error('Error writing to serial port:', err.message);
              reject(err);
            } else {
              console.log(
                'Data sent:',
                commande,
                'at',
                new Date().toISOString(),
              );
              resolve();
            }
          });
        });
        // this.port.flush();
      } else {
        console.error('Le port série est fermé');
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des données formatées à la Protenta:",
        error,
      );
    }
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
          // this.restartInactivityCheck();
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
      this.socketGateway.notification(NotificationType.Moniteur, 'inactif');
    });
    // Gestion des erreurs
    this.port.on('error', (err) => {
      console.error('Erreur du port série:', err.message);
    });

    // this.startInactivityCheck();
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
    this.socketGateway.notification(NotificationType.Moniteur, 'inactif');
  }
}
