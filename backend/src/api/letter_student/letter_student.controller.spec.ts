import { Test, TestingModule } from '@nestjs/testing';
import { LetterStudentController } from './letter_student.controller';
import { LetterStudentService } from './letter_student.service';

describe('LetterStudentController', () => {
  let controller: LetterStudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LetterStudentController],
      providers: [LetterStudentService],
    }).compile();

    controller = module.get<LetterStudentController>(LetterStudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
