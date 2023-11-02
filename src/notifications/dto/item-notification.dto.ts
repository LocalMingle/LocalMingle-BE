// path: ./src/notifications/dto/item-notification-msg.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ItemNotifDto {
  userId: number;

  notifId: number;

  content: string;

  category: string;

  link: string;

  read: boolean;
}
