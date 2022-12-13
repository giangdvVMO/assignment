import { Test, TestingModule } from '@nestjs/testing';
import { FieldRecruitService } from './field-recruit.service';

describe('FieldRecruitService', () => {
  let service: FieldRecruitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldRecruitService],
    }).compile();

    service = module.get<FieldRecruitService>(FieldRecruitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
