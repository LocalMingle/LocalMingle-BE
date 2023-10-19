import { Module } from '@nestjs/common';
import { SearchesService } from './searches.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';
import { SearchesController } from './searches.controller';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [SearchesController],
  providers: [SearchesService],
  exports: [SearchesService],
})
export class SearchesModule {}

// /search?query=특정 단어 와 같은 URL로 접근