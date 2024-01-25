// src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 유효성 검사를 위한 ValidationPipe 설정
  app.useGlobalPipes(new ValidationPipe());

  // 인터셉터를 사용하여 응답 본문에서 비밀번호를 자동으로 제거
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('LocalMingle API')
    .setDescription('The LocalMingle API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS 정책 test2
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://d2r603zvpf912o.cloudfront.net',
      'https://totobon.store',
      'https://local-mingle-fe.vercel.app',
      'https://d2k8kob2tp4v96.cloudfront.net',
      'https://localmingle.store',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키를 사용하려면 true로 설정
    exposedHeaders: ['accessToken', 'refreshToken'],
  });

  await app.listen(3000);
}

bootstrap();
