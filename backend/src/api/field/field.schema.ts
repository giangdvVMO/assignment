import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FieldDocument = Field & Document;

@Schema({
  collection: 'tbl_field',
})
export class Field {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 50 })
  nameField: string;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
