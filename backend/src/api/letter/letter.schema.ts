import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LetterDocument = Letter & Document;

@Schema({
  collection: 'tbl_letter',
})
export class Letter {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 1000, required: true })
  content: string;

  @Prop({ type: String, maxlength: 50, required: true })
  title: string;

  @Prop({ type: Number, ref: 'tbl_account' })
  id_account: number;

  @Prop({ type: Date, required: true })
  create_date: Date;
}

export const LetterSchema = SchemaFactory.createForClass(Letter);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
