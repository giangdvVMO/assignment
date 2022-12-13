import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type CVDocument = CV & Document;

@Schema({
  collection: 'tbl_cv',
})
export class CV {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 50, required: true })
  title: string;

  @Prop({ type: String, required: true })
  speciality: string;

  @Prop({ type: String, required: true })
  summary: string;

  @Prop({ type: String, required: true })
  certificate: string;

  @Prop({ type: Number, required: true })
  experience: number;

  @Prop({ type: String, required: true })
  file_cv: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: Number, ref: 'tbl_student', required: true })
  id_student: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  update_id: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  delete_id: number;

  @Prop({ type: Date, required: true })
  create_date: Date;

  @Prop({ type: Date, default: null })
  update_date: Date;

  @Prop({ type: Date, default: null })
  delete_date: Date;
}

export const CVSchema = SchemaFactory.createForClass(CV);
