import { Module } from '@nestjs/common';
import { CvViewService } from './cv-view.service';
import { CvViewController } from './cv-view.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CvView, CvViewSchema } from './cv-view.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CvView.name, schema: CvViewSchema }]),
  ],
  controllers: [CvViewController],
  providers: [CvViewService],
  exports: [CvViewService],
})
export class CvViewModule {}
