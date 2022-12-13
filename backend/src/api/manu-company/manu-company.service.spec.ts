import { Test, TestingModule } from '@nestjs/testing';
import { ManuCompanyService } from './manu-company.service';

describe('ManuCompanyService', () => {
  let service: ManuCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManuCompanyService],
    }).compile();

    service = module.get<ManuCompanyService>(ManuCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
