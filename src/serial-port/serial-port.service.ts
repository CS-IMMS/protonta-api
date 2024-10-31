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
      const receivedData = data.toString(); // Convertit le buffer en string
      console.log('Données reçues:', receivedData);

      // Si les données sont en format CSV, les diviser par la virgule
      const dataArray = receivedData.split(','); // Crée un tableau basé sur la virgule
      console.log('Données décodées:', dataArray);
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
