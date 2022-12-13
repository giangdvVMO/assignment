import { Test, TestingModule } from '@nestjs/testing';
import { CvViewService } from './cv-view.service';

describe('CvViewService', () => {
  let service: CvViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvViewService],
    }).compile();

    service = module.get<CvViewService>(CvViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
