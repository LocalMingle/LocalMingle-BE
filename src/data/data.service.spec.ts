import { DataService } from './data.service';

describe('DataService', () => {
  let dataService;
  let mockPrisma;

  beforeEach(async () => {
    mockPrisma = {
      region: {
        findMany: jest.fn(),
      },
    };
    dataService = new DataService(mockPrisma);
  });

  test('guNameData Method', async () => {
    const query = { doName: 'exampleDoName' };
    await dataService.guNameData(query);

    expect(mockPrisma.region.findMany).toHaveBeenCalledWith({
      where: { doName: query.doName },
      select: { guName: true },
    });
  });
});
