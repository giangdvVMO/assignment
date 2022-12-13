import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CV, CVSchema } from './cv.schema';
import { FieldCvModule } from '../field_cv/field_cv.module';
import { FileUploadService } from 'src/share/external-services/s3.service';
import { ManuCompanyModule } from '../manu-company/manu-company.module';
import { LetterModule } from '../letter/letter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CV.name, schema: CVSchema }]),
    FieldCvModule,
    ManuCompanyModule,
    LetterModule,
  ],
  controllers: [CvController],
  providers: [CvService, FileUploadService],
  exports: [CvService],
})
export class CvModule {}
