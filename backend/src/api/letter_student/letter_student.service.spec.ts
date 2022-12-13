import { Test, TestingModule } from '@nestjs/testing';
import { LetterStudentService } from './letter_student.service';

describe('LetterStudentService', () => {
  let service: LetterStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LetterStudentService],
    }).compile();

    service = module.get<LetterStudentService>(LetterStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
