import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountNotiDocument = AccountNoti & Document;

@Schema({
  collection: 'tbl_account_noti',
})
export class AccountNoti {
  @Prop({ type: Number, ref: 'tbl_account', required: true })
  id_account: number;

  @Prop({ type: Number, ref: 'tbl_noti', required: true })
  id_noti: number;

  @Prop({ type: String, maxlength: 20, required: true })
  position: string;
}

export const AccountNotiSchema = SchemaFactory.createForClass(AccountNoti);
