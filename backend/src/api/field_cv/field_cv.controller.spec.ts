import { Test, TestingModule } from '@nestjs/testing';
import { FieldCvController } from './field_cv.controller';
import { FieldCvService } from './field_cv.service';

describe('FieldCvController', () => {
  let controller: FieldCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldCvController],
      providers: [FieldCvService],
    }).compile();

    controller = module.get<FieldCvController>(FieldCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
