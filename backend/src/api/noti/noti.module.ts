import { Module } from '@nestjs/common';
import { NotiService } from './noti.service';
import { NotiController } from './noti.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Noti, NotiSchema } from './noti.schema';
import { AccountNotiModule } from '../account_noti/account_noti.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Noti.name, schema: NotiSchema }]),
    AccountNotiModule,
  ],
  controllers: [NotiController],
  providers: [NotiService],
  exports: [NotiService],
})
export class NotiModule {}
