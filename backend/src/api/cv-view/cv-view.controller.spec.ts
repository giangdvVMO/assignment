import { Test, TestingModule } from '@nestjs/testing';
import { CvViewController } from './cv-view.controller';
import { CvViewService } from './cv-view.service';

describe('CvViewController', () => {
  let controller: CvViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvViewController],
      providers: [CvViewService],
    }).compile();

    controller = module.get<CvViewController>(CvViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
