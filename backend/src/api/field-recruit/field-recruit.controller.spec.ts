import { Test, TestingModule } from '@nestjs/testing';
import { FieldRecruitController } from './field-recruit.controller';
import { FieldRecruitService } from './field-recruit.service';

describe('FieldRecruitController', () => {
  let controller: FieldRecruitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldRecruitController],
      providers: [FieldRecruitService],
    }).compile();

    controller = module.get<FieldRecruitController>(FieldRecruitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
