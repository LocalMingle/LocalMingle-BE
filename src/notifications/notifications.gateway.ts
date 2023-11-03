// src/notifications/notifications.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@WebSocketGateway(3001, { namespace: 'notifications' })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly notificationsService: NotificationsService) {}
  private logger = new Logger('Notification');

  @WebSocketServer() server: Server;

  afterInit() {
    this.logger.log('socket Init');
  }
  // // client와 연결이 되었을 때
  // async handleConnection(@ConnectedSocket() socket: Socket) {
  //   this.logger.log(`connected: ${socket.id}`);
  //   console.log('here');
  // }

  // 클라이언트와의 연결이 수립될 때 실행됩니다.
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  // client와 연결이 끊길 때
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
    const userId = Object.keys(this.clients).find(
      (key) => this.clients[key] === socket.id
    );
    delete this.clients[Number(userId)];
    console.log('삭제 후: ', this.clients);
  }

  clients: any = {}; // key: userId, value: socket.id
  // 0. 로그인 - 유저 정보를 Clients 에 저장
  @SubscribeMessage('login')
  async join(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log('during login: ', data, socket.id);
    this.clients[data] = socket.id;
    console.log('after login: ', this.clients);
  }

  @SubscribeMessage('tests')
  handleTest(@MessageBody('id') id: number): number {
    console.log('id: ', id);
    return id;
  }

  // 1. 유저가 참가 신청
  @SubscribeMessage('joinEvent')
  async joinEvent(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log('joinEvent: ', data, socket.id);

    // 유저가 참가신청버튼을 누르면 참가신청이 눌러진 이벤트 id를 받아서 HostEvent 테이블에서 hostId를 찾아서 알림을 보내주는 구조
    const joinedEvent =
      await this.notificationsService.userJoinEventNotification(
        data.eventId,
        data.userId
      );
    console.log('joinedEvent:  ', joinedEvent);

    const hostSocketId = this.clients[joinedEvent.UserId];
    socket.to(hostSocketId).emit('onNotification', joinedEvent);
  }
}
