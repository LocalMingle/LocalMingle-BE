// src/notifications/notifications.service.ts

import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
  private logger = new Logger('notifications.service.ts');

  // 1. 호스트가 만든 이벤트에 게스트 유저가 참가신청 시 알림을 받음
  async userJoinEventNotification(eventId: number, userId: number) {
    try {
      // eventID 를 통해 hostId를 찾는다.
      const findHostId = await this.prisma.hostEvent.findFirst({
        where: {
          EventId: eventId,
        },
        select: {
          HostId: true,
        },
      });

      const { HostId } = findHostId;
      console.log('findHostId in service: ', findHostId, HostId);

      // 호스트가 만든 이벤트에 어떤 유저가 참가신청을 하면 notification 테이블에 알림을 생성
      const notification = await this.prisma.notifications.create({
        data: {
          title: '참가 신청 알림',
          content: `유저 ${userId}님이 참가 신청을 하였습니다.`,
          UserId: HostId,
          EventId: eventId,
        },
      });
      console.log(notification);
      return notification;
    } catch (error) {
      console.log(error);
      throw new HttpException('알림 생성 실패', 500);
    }
  }
}

// model Notifications {
//   notificationId   Int      @id @default(autoincrement()) @map("id")
//   title     String
//   content   String
//   createdAt DateTime @default(now())
//   EventId   Int? // Foreign Key
//   UserId    Int? // Foreign Key

//   Event Event? @relation(fields: [EventId], references: [eventId], onDelete: Cascade)
//   User  User?  @relation(fields: [UserId], references: [userId], onDelete: Cascade)
// }
