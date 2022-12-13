import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News, NewsSchema } from './news.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldNewsModule } from '../field_news/field_news.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    FieldNewsModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
