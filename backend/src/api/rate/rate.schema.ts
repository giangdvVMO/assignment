import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

export type RateDocument = Rate & Document;

@Schema({
  collection: 'tbl_rate',
})
export class Rate {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 50, required: true })
  title: string;

  @Prop({ type: String, maxlength: 1000, required: true })
  content: string;

  @Prop({ type: String, maxlength: 20, required: true })
  type_rate: string;

  @Prop({ type: Number, required: true })
  score: number;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: Number, ref: 'tbl_student', required: true })
  id_student: number;

  @Prop({ type: Number, ref: 'tbl_company', required: true })
  id_company: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  confirm_id: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  delete_id: number;

  @Prop({ type: Date, required: true })
  create_date: Date;

  @Prop({ type: Date, default: null })
  confirm_date: Date;

  @Prop({ type: Date, default: null })
  delete_date: Date;
}

export const RateSchema = SchemaFactory.createForClass(Rate);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
