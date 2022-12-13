import { Test, TestingModule } from '@nestjs/testing';
import { RecruitViewService } from './recruit-view.service';

describe('RecruitViewService', () => {
  let service: RecruitViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruitViewService],
    }).compile();

    service = module.get<RecruitViewService>(RecruitViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
