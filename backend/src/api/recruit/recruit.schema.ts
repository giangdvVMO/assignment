import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

export type RecruitDocument = Recruit & Document;

@Schema({
  collection: 'tbl_recruit',
})
export class Recruit {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 50 })
  title: string;

  @Prop({ type: String, maxlength: 10 })
  way_working: string;

  @Prop({ type: Number })
  salary: number;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: String, maxlength: 20 })
  level: string;

  @Prop({ type: Boolean, nullable: true, default: null })
  gender: boolean;

  @Prop({ type: String, maxlength: 50 })
  address_working: string;

  @Prop({ type: Number })
  experience: number;

  @Prop({ type: String, maxlength: 1000 })
  description: string;

  @Prop({ type: String, maxlength: 1000 })
  requirement: string;

  @Prop({ type: String, maxlength: 1000 })
  welfare: string;

  @Prop({ type: Date, default: null })
  end_date: Date;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: Number, ref: 'tbl_company' })
  id_company: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  update_id: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  confirm_id: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  delete_id: number;

  @Prop({ type: Date,  required: true })
  create_date: Date;

  @Prop({ type: Date, default: null })
  update_date: Date;

  @Prop({ type: Date, default: null })
  confirm_date: Date;

  @Prop({ type: Date, default: null })
  delete_date: Date;
}

export const RecruitSchema = SchemaFactory.createForClass(Recruit);
