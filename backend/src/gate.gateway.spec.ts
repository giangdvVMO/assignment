import { Test, TestingModule } from '@nestjs/testing';
import { GateGateway } from './gate.gateway';

describe('GateGateway', () => {
  let gateway: GateGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GateGateway],
    }).compile();

    gateway = module.get<GateGateway>(GateGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
