// import { faker } from '@faker-js/faker';
// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { DataBaseService } from 'src/core/shared/dataBase/dataBase.service';
// import { PrismaService } from 'src/prismaModule/prisma-service';
// import { SocketGateway } from 'src/socket/socket.service';

// @Injectable()
// export class DataGeneratorService implements OnModuleInit {
//   constructor(
//     private readonly DataBaseService: DataBaseService,
//     private readonly prisma: PrismaService,
//     private readonly SocketGateway: SocketGateway,
//   ) {}
//   private readonly logger = new Logger(DataGeneratorService.name);
//   private currentIndex = 1;
//   // Génère les données chaque milliseconde
//   onModuleInit() {
//     setInterval(() => {
//       const data = this.generateFakeData();
//       this.logger.log(JSON.stringify(data)); // Affiche les données en JSON
//     }, 1000); // Intervalle de 1 ms
//   }

//   // Fonction pour générer les données factices
//   private async generateFakeData() {
//     // this.prisma.sensorDatas.deleteMany();
//     const data = {
//       latest: new Date().toISOString(),
//       elapsed: faker.date.recent().toISOString(),
//       localName: `I${this.currentIndex}`,
//       temperature: faker.number.int({ min: 0, max: 5000 }),
//       humidity: faker.number.int({ min: 0, max: 5000 }),
//       pressure: faker.number.int({ min: 8000, max: 11000 }),
//       light_A: faker.number.int({ min: 0, max: 1 }),
//       sol: faker.number.int({ min: 0, max: 100 }),
//       acc_x: faker.number.int({ min: 0, max: 50 }),
//       acc_y: faker.number.int({ min: 0, max: 50 }),
//       acc_z: faker.number.int({ min: 0, max: 50 }),
//       iaq: faker.number.int({ min: 0, max: 500 }),
//       gyro_x: faker.number.int({ min: 0, max: 50 }),
//       gyro_y: faker.number.int({ min: 0, max: 50 }),
//       gyro_z: faker.number.int({ min: 0, max: 50 }),
//       accuracy: faker.number.int({ min: 0, max: 1 }),
//       gaz: faker.number.int({ min: 0, max: 1 }),
//       co2: faker.number.int({ min: 0, max: 1 }),
//       SeuilHumidity_min: faker.number.int({ min: 0, max: 50 }),
//       SeuilHumidity_max: faker.number.int({ min: 0, max: 50 }),
//       SeuilTemp_min: faker.number.int({ min: 0, max: 50 }),
//       SeuilTemp_max: faker.number.int({ min: 0, max: 50 }),
//       SeuilLum_min: faker.number.int({ min: 0, max: 50 }),
//       SeuilLum_max: faker.number.int({ min: 0, max: 50 }),
//       SeuilPression_min: faker.number.int({ min: 0, max: 50 }),
//       SeuilPression_max: faker.number.int({ min: 0, max: 50 }),
//       SeuilCo2_min: faker.number.int({ min: 0, max: 50 }),
//       SeuilCo2_max: faker.number.int({ min: 0, max: 50 }),
//       MeanTemp: faker.number.int({ min: 0, max: 5000 }),
//       MeanHumidity: faker.number.int({ min: 0, max: 5000 }),
//       MeanLum: faker.number.int({ min: 0, max: 50000 }),
//       MeanPress: faker.number.int({ min: 8000, max: 11000 }),
//       MeanCo2: faker.number.int({ min: 0, max: 500 }),
//       S1: faker.number.int({ min: 0, max: 1 }),
//       S2: faker.number.int({ min: 0, max: 1 }),
//       S3: faker.number.int({ min: 0, max: 1 }),
//       S4: faker.number.int({ min: 0, max: 1 }),
//       S5: faker.number.int({ min: 0, max: 1 }),
//       S6: faker.number.int({ min: 0, max: 1 }),
//       S7: faker.number.int({ min: 0, max: 1 }),
//       S8: faker.number.int({ min: 0, max: 3 }),
//       S9: faker.number.int({ min: 0, max: 1 }),
//       S10: faker.number.int({ min: 0, max: 1 }),
//       S11: faker.number.int({ min: 0, max: 1 }),
//       S12: faker.number.int({ min: 0, max: 1 }),
//       S13: faker.number.int({ min: 0, max: 1 }),
//       S14: faker.number.int({ min: 0, max: 1 }),
//       S15: faker.number.int({ min: 0, max: 1 }),
//       S16: faker.number.int({ min: 0, max: 1 }),
//       MomentFloraison: false,
//     };
//     this.currentIndex++;
//     if (this.currentIndex > 15) {
//       this.currentIndex = 1;
//     }
//     await this.prisma.sensorDatas.create({ data });
//     // this.SocketGateway.sendSensorData(data);
//     console.log('data send......');

//     return data;
//   }
// }
