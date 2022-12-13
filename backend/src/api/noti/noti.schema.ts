import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

export type NotiDocument = Noti & Document;

@Schema({
  collection: 'tbl_noti',
})
export class Noti {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 50, required: true })
  title: string;

  @Prop({ type: String, maxlength: 20, required: true })
  type: string;

  @Prop({ type: String, maxlength: 1000, required: true })
  content: string;

  @Prop({ type: String, default: null })
  link: string;

  @Prop({ type: Boolean, default: false, required: true })
  status: boolean;

  @Prop({ type: Date, required: true })
  create_date: Date;
}

export const NotiSchema = SchemaFactory.createForClass(Noti);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
