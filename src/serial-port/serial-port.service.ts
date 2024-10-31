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
      this.readData();
    } else {
      console.error('Aucun port USB disponible trouvé.');
    }
  }
  private async findSerialPort(): Promise<string | null> {
    const ports = await SerialPort.list();
    const usbPort = ports.find(
      (port) =>
        port.path.includes('ttyUSB') ||
        port.path.includes('ttyACM') ||
        port.path.includes('001'), // Vérifie si le port est sur le bus 001
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
      baudRate: 115200,
    });

    this.port.on('data', (data: any) => {
      console.log('Données reçues:', data);
      const receivedData = data.toString();
      console.log('Données reçues:', this.bufferToAscii(receivedData));
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
        resolve(this.bufferToAscii(data));
      });

      this.port.once('error', (err) => {
        reject(err);
      });
    });
  }
  private bufferToAscii(bufferData: { type: string; data: number[] }): string {
    const buffer = Buffer.from(bufferData.data); // Crée un buffer à partir du tableau de données
    return buffer.toString('ascii'); // Convertit le buffer en chaîne ASCII
  }
}
