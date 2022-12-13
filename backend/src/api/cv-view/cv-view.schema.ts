import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CvViewDocument = CvView & Document;

@Schema({
  collection: 'tbl_cv_view',
})
export class CvView {
  @Prop({ type: Number, ref: 'tbl_cv' })
  id_cv: number;

  @Prop({ type: Number, ref: 'tbl_company' })
  id_company: number;

  @Prop({ type: Number, default: 0 })
  views: number;
}

export const CvViewSchema = SchemaFactory.createForClass(CvView);
CvViewSchema.index({ id_company: 1, id_cv: 1 }, { unique: true });
