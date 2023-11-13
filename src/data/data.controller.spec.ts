import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('CityController', () => {
  let controller: DataController;
  let dataService: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataController],
      providers: [DataService],
      imports: [PrismaModule]
    }).compile();

    controller = module.get<DataController>(DataController);
    dataService = module.get<DataService>(DataService);
  });

  describe('cityData', () => {
    it('should return city data for a valid language', async () => {
      const mockQuery = { lang: 'en' };

      const mockCityData = {
        lang: 'en',
        items: [
          { doName: 'City / Province'},
          { doName: 'Seoul' },
          { doName: 'Busan' },
          { doName: 'Daegu' },
          { doName: 'Incheon' },
          { doName: 'Gwangju' },
          { doName: 'Daejeon' },
          { doName: 'Ulsan' },
          { doName: 'Sejong' },
          { doName: 'Gyeonggi-do' },
          { doName: 'Gangwon-do' },
          { doName: 'Chungcheongbuk-do' },
          { doName: 'Chungcheongnam-do' },
          { doName: 'Jeollabuk-do' },
          { doName: 'Jeollanam-do' },
          { doName: 'Gyeongsangbuk-do' },
          { doName: 'Gyeongsangnam-do' },
          { doName: 'Jeju-do' },
        ],
      }

      const result = await controller.cityData(mockQuery);

      expect(result).toEqual(mockCityData);
    });

    it('should return an error message for an invalid language', async () => {
      const mockQuery = { lang: 'fr' };

      const result = await controller.cityData(mockQuery);

      expect(result).toEqual({ message: '[ko, en, jp] 중 하나를 입력하세요' });
    });
  });
});
