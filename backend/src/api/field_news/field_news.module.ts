import { Module } from '@nestjs/common';
import { FieldNewsService } from './field_news.service';
import { FieldNewsController } from './field_news.controller';
import { FieldNews, FieldNewsSchema } from './field_new.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldNews.name, schema: FieldNewsSchema },
    ]),
  ],
  controllers: [FieldNewsController],
  providers: [FieldNewsService],
  exports: [FieldNewsService],
})
export class FieldNewsModule {}
