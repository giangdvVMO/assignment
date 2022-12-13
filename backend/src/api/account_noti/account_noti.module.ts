import { Module } from '@nestjs/common';
import { AccountNotiService } from './account_noti.service';
import { AccountNotiController } from './account_noti.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountNoti, AccountNotiSchema } from './account_noti.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountNoti.name, schema: AccountNotiSchema },
    ]),
  ],
  controllers: [AccountNotiController],
  providers: [AccountNotiService],
  exports: [AccountNotiService],
})
export class AccountNotiModule {}
