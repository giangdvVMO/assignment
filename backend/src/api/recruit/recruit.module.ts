import { Module } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { RecruitController } from './recruit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recruit, RecruitSchema } from './recruit.schema';
import { FieldRecruitModule } from '../field-recruit/field-recruit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recruit.name, schema: RecruitSchema }]),
    FieldRecruitModule,
  ],
  controllers: [RecruitController],
  providers: [RecruitService],
  exports: [RecruitService],
})
export class RecruitModule {}
