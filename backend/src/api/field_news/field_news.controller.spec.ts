import { Test, TestingModule } from '@nestjs/testing';
import { FieldNewsController } from './field_news.controller';
import { FieldNewsService } from './field_news.service';

describe('FieldNewsController', () => {
  let controller: FieldNewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldNewsController],
      providers: [FieldNewsService],
    }).compile();

    controller = module.get<FieldNewsController>(FieldNewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
