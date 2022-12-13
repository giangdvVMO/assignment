import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FieldCVDocument = FieldCV & Document;

@Schema({
  collection: 'tbl_field_cv',
})
export class FieldCV {
  @Prop({ type: Number, ref: 'tbl_field' })
  id_field: number;

  @Prop({ type: Number, ref: 'tbl_cv' })
  id_cv: number;
}

export const FieldCVSchema = SchemaFactory.createForClass(FieldCV);
FieldCVSchema.index({ id_field: 1, id_cv: 1 }, { unique: true });
