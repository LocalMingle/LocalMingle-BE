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
      // eventID 를 통해 event 정보를 찾는다.
      const event = await this.prisma.event.findUnique({
        where: { eventId, isDeleted: false },
        include: {
          HostEvents: {
            select: {
              HostId: true,
              User: {
                select: {
                  UserDetail: {
                    select: {
                      nickname: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const hostId = event.HostEvents[0].HostId;
      const hostNickname = event.HostEvents[0].User.UserDetail[0].nickname;
      const guest = await this.prisma.userDetail.findFirst({
        where: { UserId: userId },
        select: { nickname: true },
      });
      const guestNickname = guest.nickname;

      console.log('host id: ', hostId);
      console.log('host nickname: ', hostNickname);
      console.log('guest nickname: ', guestNickname);
      console.log('eventName:', event.eventName);

      // 호스트가 만든 이벤트에 어떤 유저가 참가신청을 하면 notification 테이블에 알림을 생성
      const notification = await this.prisma.notifications.create({
        data: {
          title: '이벤트 참가 신청 알림',
          content: `${guestNickname}님이 ${event.eventName}이벤트에 참가 신청을 하였습니다.`,
          UserId: Number(hostId), // 알림을 받는 유저의 id = 호스트Id
          EventId: eventId,
        },
      });
      return notification;
    } catch (error) {
      this.logger.error(`알림 생성 중 에러 발생: ${error.message}`);
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
