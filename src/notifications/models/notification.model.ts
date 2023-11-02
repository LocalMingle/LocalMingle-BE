// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, SchemaOptions } from 'mongoose';

// const options: SchemaOptions = {
//   collection: 'notifications', // 데이터베이스명
//   timestampe: true, // 생성, 수정 시간 자동 저장
// };

// @Schema(options)
// export class Notification extends Document {
//   @Prop()
//   userId: number;

//   @Prop()
//   message: string;

//   @Prop()
//   link: string;

//   @Prop({ required: false })
//   read: boolean;
// }

// export const NotificationSchema = SchemaFactory.createForClass(Notification);
