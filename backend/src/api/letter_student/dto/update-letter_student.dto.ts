import { PartialType } from '@nestjs/swagger';
import { CreateLetterStudentDto } from './create-letter_student.dto';

export class UpdateLetterStudentDto extends PartialType(CreateLetterStudentDto) {}
