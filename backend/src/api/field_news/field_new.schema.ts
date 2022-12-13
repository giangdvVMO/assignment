import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FieldNewsDocument = FieldNews & Document;

@Schema({
  collection: 'tbl_field_news',
})
export class FieldNews {
  @Prop({ type: Number, ref: 'tbl_field' })
  id_field: number;

  @Prop({ type: Number, ref: 'tbl_news' })
  id_news: number;
}

export const FieldNewsSchema = SchemaFactory.createForClass(FieldNews);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
