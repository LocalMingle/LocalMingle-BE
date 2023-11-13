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

@WebSocketGateway({
  cors: {
    origin: '*', // or "http://localhost:xxxx"
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly notificationsService: NotificationsService) {}
  private logger = new Logger('Notification');

  @WebSocketServer() server: Server;

  afterInit() {
    this.logger.log('socket Init');
  }

  // 클라이언트와의 연결이 수립될 때 실행됩니다.
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.server.on('connection', (socket) => {
      console.log('conenction socket.id: ', socket.id);
    });
    this.logger.log(
      `Client connected: ${socket.id} to namespace: ${socket.nsp.name}`
    );
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

  // 1. 유저가 참가 신청
  @SubscribeMessage('joinEvent')
  async joinEvent(
    @MessageBody()
    notificationData: {
      message: string;
      eventId: number;
      userId: number;
    },
    @ConnectedSocket() socket: Socket
  ) {
    this.logger.log(
      `New RSVP notification in event ${notificationData.eventId}: ${notificationData.message}`
    );
    console.log('joinEvent: ', notificationData, socket.id);

    // 유저가 참가신청버튼을 누르면 참가신청이 눌러진 이벤트 id를 받아서 HostEvent 테이블에서 hostId를 찾아서 알림을 보내주는 구조
    const joinedEvent =
      await this.notificationsService.userJoinEventNotification(
        notificationData.eventId,
        notificationData.userId
      );
    console.log('joinedEvent:  ', joinedEvent);

    const hostSocketId = this.clients[16]; // 호스트에게 알림 보내기
    // const hostSocketId = this.clients[joinedEvent.UserId]; // 호스트에게 알림 보내기
    socket.to(hostSocketId).emit('onNotification', joinedEvent);
  }
}
