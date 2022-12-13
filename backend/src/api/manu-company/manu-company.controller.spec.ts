import { Test, TestingModule } from '@nestjs/testing';
import { ManuCompanyController } from './manu-company.controller';
import { ManuCompanyService } from './manu-company.service';

describe('ManuCompanyController', () => {
  let controller: ManuCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManuCompanyController],
      providers: [ManuCompanyService],
    }).compile();

    controller = module.get<ManuCompanyController>(ManuCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
