import { Module } from '@nestjs/common';
import { LetterStudentService } from './letter_student.service';
import { LetterStudentController } from './letter_student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LetterStudent, LetterStudentSchema } from './letter_student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LetterStudent.name, schema: LetterStudentSchema },
    ]),
  ],
  controllers: [LetterStudentController],
  providers: [LetterStudentService],
  exports: [LetterStudentService],
})
export class LetterStudentModule {}
