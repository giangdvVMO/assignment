import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rate, RateSchema } from './rate.schema';
import { ApplyModule } from '../apply/apply.module';
import { LetterModule } from '../letter/letter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rate.name, schema: RateSchema }]),
    ApplyModule,
    LetterModule,
  ],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
