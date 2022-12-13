import { Test, TestingModule } from '@nestjs/testing';
import { AccountNotiController } from './account_noti.controller';
import { AccountNotiService } from './account_noti.service';

describe('AccountNotiController', () => {
  let controller: AccountNotiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountNotiController],
      providers: [AccountNotiService],
    }).compile();

    controller = module.get<AccountNotiController>(AccountNotiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
