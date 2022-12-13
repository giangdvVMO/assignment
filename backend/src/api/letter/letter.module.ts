import { Module } from '@nestjs/common';
import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Letter, LetterSchema } from './letter.schema';
import { LetterStudentModule } from '../letter_student/letter_student.module';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Letter.name, schema: LetterSchema }]),
    LetterStudentModule,
    UserModule,
    CompanyModule,
  ],
  controllers: [LetterController],
  providers: [LetterService],
  exports: [LetterService],
})
export class LetterModule {}
