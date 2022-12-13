import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type CompanyDocument = Company & Document;

@Schema({
  collection: 'tbl_company',
})
export class Company {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 50 })
  com_name: string;

  @Prop({ type: String, maxlength: 100 })
  address: string;

  @Prop({ type: Number })
  year: number;

  @Prop({ type: String, maxlength: 15 })
  com_phone: string;

  @Prop({ type: String, maxlength: 30 })
  com_email: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: String, maxlength: 30 })
  website: string;

  @Prop({ type: Number })
  scale: number;

  @Prop({ type: String, maxlength: 1000 })
  introduction: string;

  @Prop({ type: String, maxlength: 100 })
  avatar: string;

  @Prop({ type: Number, ref: 'tbl_account' })
  id_account: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  update_id: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  confirm_id: number;

  @Prop({ type: Date, required: true })
  create_date: Date;

  @Prop({ type: Date, default: null })
  update_date: Date;

  @Prop({ type: Date, default: null })
  confirm_date: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
