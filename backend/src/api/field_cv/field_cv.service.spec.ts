import { Test, TestingModule } from '@nestjs/testing';
import { FieldCvService } from './field_cv.service';

describe('FieldCvService', () => {
  let service: FieldCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldCvService],
    }).compile();

    service = module.get<FieldCvService>(FieldCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
