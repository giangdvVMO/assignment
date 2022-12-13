import { Test, TestingModule } from '@nestjs/testing';
import { RecruitViewController } from './recruit-view.controller';
import { RecruitViewService } from './recruit-view.service';

describe('RecruitViewController', () => {
  let controller: RecruitViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruitViewController],
      providers: [RecruitViewService],
    }).compile();

    controller = module.get<RecruitViewController>(RecruitViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
