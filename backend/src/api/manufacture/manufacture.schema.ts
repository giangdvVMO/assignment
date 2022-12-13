import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManufactureDocument = Manufacture & Document;

@Schema({
  collection: 'tbl_manufacture',
})
export class Manufacture {
  @Prop()
  _id: number;

  @Prop({ type: String, unique: true, required: true })
  name_manu: string;
}

export const ManufactureSchema = SchemaFactory.createForClass(Manufacture);
