import { ApiTags } from '@nestjs/swagger';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorDataGet, SensorDataPost } from './interfaces/monitor.interface';
import { MonitorService } from './monitor.service';
@ApiTags('WebSocket')
@WebSocketGateway({
  cors: {
    origin: '*', // Pour autoriser les requêtes de toutes les origines (à sécuriser en production)
  },
})
export class SensorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private monitorService: MonitorService) {}
  @WebSocketServer() server: Server;

  private sensorData: SensorDataPost | null = null; // Pour stocker les dernières données de capteurs
  private commands: SensorDataGet = {
    S0: 0,
    S1: 0,
    S2: 0,
    S3: 0,
    S4: 0,
    S5: 0,
    S6: 0,
    S7: 0,
    S8: 0,
    S9: 0,
    S10: 0,
    S11: 0,
    S12: 0,
    S13: 0,
    S14: 0,
    S15: 0,
    SeuilHumidity_min: 0,
    SeuilHumidity_max: 100,
    SeuilTemp_min: 0,
    SeuilTemp_max: 50,
    SeuilLum_min: 0,
    SeuilLum_max: 1000,
    SeuilPression_min: 900,
    SeuilPression_max: 1100,
    SeuilCo2_min: 0,
    SeuilCo2_max: 5000,
    MomentFloraison: false,
    pollinationStartTime: 6,
    pollinationEndTime: 18,
    year: 2024,
    month: 10,
    day: 18,
    hour: 0,
    minute: 0,
    second: 0,
  }; // Commandes initialisées

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

  // Réception des données du capteur via WebSocket
  @SubscribeMessage('sensorData')
  handleSensorData(client: Socket, payload: SensorDataPost): void {
    console.log('Data received from sensor:', payload);
    this.sensorData = payload;

    // Diffusion des données reçues à tous les clients
    this.server.emit('sensorDataUpdate', this.sensorData);
    this.monitorService.createSensorData(this.sensorData);
  }

  // Envoi des commandes au dispositif connecté à la demande du client React
  @SubscribeMessage('getCommands')
  handleGetCommands(client: Socket, payload: any): void {
    console.log('Sending current commands to the device');
    console.log('commande: ', payload);
    
    client.emit('commands', this.commands); 
  }

  // Mise à jour des commandes depuis le client React
  @SubscribeMessage('updateCommands')
  handleUpdateCommands(
    client: Socket,
    newCommands: Partial<SensorDataGet>,
  ): void {
    console.log('Updating commands from client:', newCommands);
    this.commands = { ...this.commands, ...newCommands }; // Mise à jour partielle des commandes

    // Diffusion des nouvelles commandes à tous les clients
    this.server.emit('commandsUpdate', this.commands);
  }
}
