import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FieldRecruitDocument = FieldRecruit & Document;

@Schema({
  collection: 'tbl_field_recruit',
})
export class FieldRecruit {
  @Prop({ type: Number, required: true })
  id_field: number;

  @Prop({ type: Number, required: true })
  id_recruit: number;
}

export const FieldRecruitSchema = SchemaFactory.createForClass(FieldRecruit);
FieldRecruitSchema.index({ id_field: 1, id_recruit: 1 }, { unique: true });
