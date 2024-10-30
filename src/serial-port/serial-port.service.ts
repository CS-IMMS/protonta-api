import { Injectable, OnModuleInit } from '@nestjs/common';
import { SerialPort } from 'serialport';

@Injectable()
export class SerialPortService implements OnModuleInit {
  private port: SerialPort;

  async onModuleInit() {
    const portPath = await this.findSerialPort();
    console.log('portPath:::', portPath);

    if (portPath) {
      this.initializeSerialPort(portPath);
    } else {
      console.error('Aucun port USB disponible trouvé.');
    }
  }
  private async findSerialPort(): Promise<string | null> {
    const ports = await SerialPort.list();
    const usbPort = ports.find(
      (port) => port.path.includes('ttyUSB') || port.path.includes('ttyACM'),
    );

    if (usbPort) {
      console.log(`Port USB trouvé : ${usbPort.path}`);
      return usbPort.path;
    } else {
      return null;
    }
  }

  private initializeSerialPort(portPath: string) {
    this.port = new SerialPort({
      path: portPath,
      baudRate: 11150,
    });

    this.port.on('data', (data: any) => {
      console.log('Données reçues:', data);
    });

    // Gestion des erreurs
    this.port.on('error', (err) => {
      console.error('Erreur du port série:', err.message);
    });
  }

  // Méthode pour lire des données
  public readData(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.port.once('data', (data: any) => {
        resolve(data);
      });

      this.port.once('error', (err) => {
        reject(err);
      });
    });
  }
}
