import { Module } from '@nestjs/common';
import { RecruitViewService } from './recruit-view.service';
import { RecruitViewController } from './recruit-view.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitView, RecruitViewSchema } from './recruit-view.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecruitView.name, schema: RecruitViewSchema },
    ]),
  ],
  controllers: [RecruitViewController],
  providers: [RecruitViewService],
  exports: [RecruitViewService],
})
export class RecruitViewModule {}
