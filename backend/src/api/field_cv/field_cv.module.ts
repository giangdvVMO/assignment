import { Module } from '@nestjs/common';
import { FieldCvService } from './field_cv.service';
import { FieldCvController } from './field_cv.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldCV, FieldCVSchema } from './field_cv.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FieldCV.name, schema: FieldCVSchema }]),
  ],
  controllers: [FieldCvController],
  providers: [FieldCvService],
  exports: [FieldCvService],
})
export class FieldCvModule {}
