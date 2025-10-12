import { Test, TestingModule } from '@nestjs/testing';
import { ReservateController } from './reservate.controller';
import { ReservateService } from './reservate.service';

describe('ReservateController', () => {
  let controller: ReservateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservateController],
      providers: [ReservateService],
    }).compile();

    controller = module.get<ReservateController>(ReservateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
