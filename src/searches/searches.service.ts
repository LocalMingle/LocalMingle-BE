import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchesDto } from './searches.dto/searches.dto';

@Injectable()
export class SearchesService {
  constructor(private readonly prisma: PrismaService) {}

  search(searchesDto: SearchesDto) {
    return this.prisma.event.findMany({
      where: {
        isDeleted: false,
        AND: [
          searchesDto.keyWord
            ? {
                OR: [
                  { eventName: { contains: searchesDto.keyWord } },
                  { content: { contains: searchesDto.keyWord } },
                ],
              }
            : {},
          searchesDto.verify
            ? { isVerified: { contains: searchesDto.verify } }
            : {},
          searchesDto.city
            ? { location_City: { contains: searchesDto.city } }
            : {},
          searchesDto.guName
            ? { location_District: { contains: searchesDto.guName } }
            : {},
          searchesDto.category
            ? { category: { contains: searchesDto.category } }
            : {},
        ],
      },
      include: {
        HostEvents: {
          select: {
            User: {
              select: {
                UserDetail: true,
              },
            },
          },
        },
        GuestEvents: true,
        _count: {
          select: {
            Viewlogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
