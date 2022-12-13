import { Module } from '@nestjs/common';
import { FieldRecruitService } from './field-recruit.service';
import { FieldRecruitController } from './field-recruit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldRecruit, FieldRecruitSchema } from './field.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldRecruit.name, schema: FieldRecruitSchema },
    ]),
  ],
  controllers: [FieldRecruitController],
  providers: [FieldRecruitService],
  exports: [FieldRecruitService],
})
export class FieldRecruitModule {}
