import { Controller, Get } from '@nestjs/common';
import { SerialPortService } from './serial-port.service';

@Controller('serial-port')
export class SerialPortController {
  constructor(private readonly serialPortService: SerialPortService) {}

  @Get('read')
  async readData(): Promise<any> {
    try {
      const data = await this.serialPortService.readData();
      return data;
    } catch (error) {
      throw new Error(
        'Erreur lors de la lecture des données: ' + error.message,
      );
    }
  }
}
