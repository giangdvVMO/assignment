import { Test, TestingModule } from '@nestjs/testing';
import { AccountNotiService } from './account_noti.service';

describe('AccountNotiService', () => {
  let service: AccountNotiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountNotiService],
    }).compile();

    service = module.get<AccountNotiService>(AccountNotiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
