import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with specific origins
  },
  namespace: 'contracts',
})
export class ContractGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinProperty')
  handleJoinProperty(
    @MessageBody() data: { propertyId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `property_${data.propertyId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined room: ${roomName}`);
    return { event: 'joined', data: roomName };
  }

  @SubscribeMessage('leaveProperty')
  handleLeaveProperty(
    @MessageBody() data: { propertyId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `property_${data.propertyId}`;
    client.leave(roomName);
    console.log(`Client ${client.id} left room: ${roomName}`);
    return { event: 'left', data: roomName };
  }

  /**
   * Broadcast specific contract updates to all stakeholders in a property room.
   */
  emitContractUpdate(propertyId: number, event: string, payload: any) {
    const roomName = `property_${propertyId}`;
    this.server.to(roomName).emit(event, payload);
  }
}
