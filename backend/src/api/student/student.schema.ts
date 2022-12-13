import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

export type StudentDocument = Student & Document;

@Schema({
  collection: 'tbl_student',
})
export class Student {
  @Prop()
  _id: number;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String, unique: true })
  cccd: string;

  @Prop({ type: String, maxlength: 50 })
  university: string;

  @Prop({ type: String, maxlength: 50 })
  faculty: string;

  @Prop({ type: String, maxlength: 50 })
  major: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: String })
  course: string;

  @Prop({ type: Number })
  gpa: number;

  @Prop({ type: String, maxlength: 20 })
  card_student: string;

  @Prop({ type: String, maxlength: 100 })
  avatar: string;

  @Prop({ type: Number, ref: 'tbl_account' })
  id_account: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  update_id: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  confirm_id: number;

  @Prop({ type: Date, default: moment().utc(true), required: true })
  create_date: Date;

  @Prop({ type: Date, default: null })
  update_date: Date;

  @Prop({ type: Date, default: null })
  confirm_date: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
