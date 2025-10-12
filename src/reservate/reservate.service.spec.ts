import { Test, TestingModule } from '@nestjs/testing';
import { ReservateService } from './reservate.service';

describe('ReservateService', () => {
  let service: ReservateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservateService],
    }).compile();

    service = module.get<ReservateService>(ReservateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
