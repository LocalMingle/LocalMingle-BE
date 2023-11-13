import { SearchesService } from './searches.service';

describe('SearchesService', () => {
  let searchesService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      event: {
        findMany: jest.fn(),
      },
    };
    searchesService = new SearchesService(mockPrisma);
  });

  test('search', async () => {
    const page = 1;
    const searchesDto = {
      keyWord: 'exampleKeyword',
      verify: true,
      city: 'exampleCity',
      guName: 'exampleGuName',
      category: 'exampleCategory',
    };

    await searchesService.search(page, searchesDto);

    expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
      take: 4,
      skip: page,
      where: {
        isDeleted: false,
        AND: expect.arrayContaining([
          expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                eventName: { contains: searchesDto.keyWord },
              }),
              expect.objectContaining({
                content: { contains: searchesDto.keyWord },
              }),
            ]),
          }),
          expect.objectContaining({
            isVerified: { contains: searchesDto.verify },
          }),
          expect.objectContaining({
            location_City: { contains: searchesDto.city },
          }),
          expect.objectContaining({
            location_District: { contains: searchesDto.guName },
          }),
          expect.objectContaining({
            category: { contains: searchesDto.category },
          }),
        ]),
      },
      include: expect.any(Object),
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
});
