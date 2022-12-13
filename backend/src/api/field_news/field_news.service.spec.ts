import { Test, TestingModule } from '@nestjs/testing';
import { FieldNewsService } from './field_news.service';

describe('FieldNewsService', () => {
  let service: FieldNewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldNewsService],
    }).compile();

    service = module.get<FieldNewsService>(FieldNewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
