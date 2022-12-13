import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LetterStudentDocument = LetterStudent & Document;

@Schema({
  collection: 'tbl_letter_student',
})
export class LetterStudent {
  @Prop({ type: Number, ref: 'tbl_letter', required: true })
  id_letter: number;

  @Prop({ type: Number, ref: 'tbl_student', required: true })
  id_student: number;
}

export const LetterStudentSchema = SchemaFactory.createForClass(LetterStudent);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
