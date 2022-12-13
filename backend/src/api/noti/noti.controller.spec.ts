import { Test, TestingModule } from '@nestjs/testing';
import { NotiController } from './noti.controller';
import { NotiService } from './noti.service';

describe('NotiController', () => {
  let controller: NotiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotiController],
      providers: [NotiService],
    }).compile();

    controller = module.get<NotiController>(NotiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
