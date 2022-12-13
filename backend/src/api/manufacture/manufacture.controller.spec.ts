import { Test, TestingModule } from '@nestjs/testing';
import { ManufactureController } from './manufacture.controller';
import { ManufactureService } from './manufacture.service';

describe('ManufactureController', () => {
  let controller: ManufactureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufactureController],
      providers: [ManufactureService],
    }).compile();

    controller = module.get<ManufactureController>(ManufactureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
