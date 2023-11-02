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
// import { ItemNotifDto } from './dto/item-notification.dto';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ namespace: '/notification' })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly notificationsService: NotificationsService) {}
  private logger = new Logger('Notification');

  @WebSocketServer() public server: Server;

  afterInit() {
    this.logger.log('socket Init');
  }
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
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
  async joinEvent(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log('joinEvent: ', data, socket.id);

    // 유저가 참가신청버튼을 누르면 참가신청이 눌러진 이벤트 id를 받아서 HostEvent 테이블에서 hostId를 찾아서 알림을 보내주는 구조
    const joinedEvent =
      await this.notificationsService.userJoinEventNotification(
        data.eventId,
        data.userId
      );
    console.log('joinedEvent: ', joinedEvent);

    // 해당 이벤트의 호스트에게 알람 emit
    // const findHostId: any = await this.notificationsService.findHostId(
    //   data.eventId
    // );
    // console.log('findHostId: ', findHostId);

    const hostSocketId = this.clients[joinedEvent.UserId];
    socket.to(hostSocketId).emit('onNotification', joinedEvent);
  }
}

// 여기에서 notification을 구현할거야
// 1. 유저가 내가 만든 이벤트에 다른 유저가 참가신청 시 알림을 받음
// 유저가 내가 만든 이벤트에 참가 신청했던 유저가 참가신청을 취소 시 알림을 받음
// 유저가 내가 참가 신청한 이벤트의 승인을 받으면 알림을 받음
// 유저가 내가 참가 신청한 이벤트의 거절을 받으면 알림을 받음
// 메시지를 받으면 알림을 받음
// }
