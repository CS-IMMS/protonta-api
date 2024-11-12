import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { ReadlineParser, SerialPort } from 'serialport';
import { DataBaseService } from './core/shared/dataBase/dataBase.service';
import {
  convertBufferData,
  IMonitorData,
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
  async sendCommande(commande: MonitorCommandeDto) {
    try {
      const oneMinuteAgo = new Date(Date.now() - 10 * 1000);
      const data = await this.prisma.sensorDatas.findFirst({
        where: { timestamp: { gte: oneMinuteAgo } },
        orderBy: { timestamp: 'desc' },
      });

      // Définir les valeurs par défaut pour les seuils et la pollinisation
      const defaultThresholds = {
        HumMin: data?.SeuilHumidity_min ?? 0,
        HumMax: data?.SeuilHumidity_max ?? 0,
        TemMin: data?.SeuilTemp_min ?? 0,
        TemMax: data?.SeuilTemp_max ?? 0,
        LumMin: data?.SeuilLum_min ?? 0,
        LumMax: data?.SeuilLum_max ?? 0,
        PressMin: data?.SeuilPression_min ?? 0,
        PressMax: data?.SeuilPression_max ?? 0,
        Co2Min: data?.SeuilCo2_min ?? 0,
        Co2Max: data?.SeuilCo2_max ?? 0,
      };

      const defaultPollination = {
        PolStartTime: data?.PolStartTime ?? 0,
        PolEndTime: data?.PolEndTime ?? 0,
        Periode: data?.Periode ?? 0,
        MomentFloraison: data?.MomentFloraison ?? 0,
      };

      // Vérifier si une des valeurs de seuils est présente dans `commande`
      if (this.isAnyFieldPresent(commande, Object.keys(defaultThresholds))) {
        this.applyDefaultValues(commande, defaultThresholds);
      }

      // Vérifier si une des valeurs de pollinisation est présente dans `commande`
      if (this.isAnyFieldPresent(commande, Object.keys(defaultPollination))) {
        this.applyDefaultValues(commande, defaultPollination);
      }

      const newCommande = await this.processToTransformData(commande);
      await this.sendDataToProtenta(newCommande);
      return { message: 'Commande envoyée', commande: newCommande };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
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

  // Fonction utilitaire pour remplir les valeurs par défaut
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
        //  this.prisma.notification.create({
        //   data: {
        //     type: alert.type as NotificationType,
        //     value: alert.value,
        //   },
        // });
      }
    });
  }
  private async sendDataToProtenta(commande: string) {
    try {
      // Send the formatted data to the Protenta via Serial Port
      if (this.port && this.port.isOpen) {
        this.port.write(commande, (err) => {
          if (err) {
            console.error(
              "Erreur lors de l'envoi des données à la Protenta:",
              err.message,
            );
          } else {
            console.log('Données envoyées à la Protenta:', commande);
          }
        });
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
