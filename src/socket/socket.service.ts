import { ApiTags } from '@nestjs/swagger';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationType } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { ISensorDataPost } from 'src/monitor/interfaces/monitor.interface';
import { PrismaService } from 'src/prismaModule/prisma-service';

@ApiTags('WebSocket')
@WebSocketGateway({
  cors: {
    origin: '*', // À sécuriser en production pour n'autoriser que les domaines de confiance
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private sensorData: ISensorDataPost | null = null;
  constructor(private readonly prisma: PrismaService) {}
  // Initialisation du WebSocket Gateway
  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  // Gestion de la connexion d'un nouveau client
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Gestion de la déconnexion d'un client
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendSensorData(data: ISensorDataPost) {
    this.sensorData = data;
    this.server.emit('monitorDataOnLive', this.sensorData);
  }
  notification(type: NotificationType, value: string) {
    const notificationData = { type, value: value };
    this.server.emit('notifications', notificationData);
    this.prisma.notification.create({
      data: {
        type: type,
        value: value,
      },
    });
  }
}
