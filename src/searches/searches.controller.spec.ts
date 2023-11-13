import { SearchesController } from './searches.controller';
import { SearchesDto } from './searches.dto/searches.dto';

describe('SearchesController', () => {
  let searchesController
  let mockSearchesService

  beforeEach(async () => {
    mockSearchesService = {
      search: jest.fn()
    }
    searchesController = new SearchesController(mockSearchesService)
  });

  test('search Method', async () =>{
    const sampleEvents = [
      {
        eventId: 1,
        eventName: "Developer",
        content: "안녕하세요",
        createdAt: "2023-08-25T03:43:20",
        updatedAt: "2023-08-25T03:43:20",
      },
      {
        eventId: 2,
        eventName: "Developer",
        content: "안녕하세요",
        createdAt: "2023-08-26T03:43:20",
        updatedAt: "2023-08-26T03:43:20",
      },
    ];

    mockSearchesService.search.mockReturnValue(sampleEvents)
    const searchDto = SearchesDto

    await searchesController.searchBy(1, searchDto)

    expect(mockSearchesService.search).toHaveBeenCalledTimes(1)
  })
});
