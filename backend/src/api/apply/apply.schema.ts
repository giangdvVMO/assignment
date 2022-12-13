import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

export type ApplyDocument = Apply & Document;

@Schema({
  collection: 'tbl_apply',
})
export class Apply {
  @Prop({ type: Number, ref: 'tbl_student', required: true })
  id_student: number;

  @Prop({ type: Number, ref: 'tbl_recruit', required: true })
  id_recruit: number;

  @Prop({ type: Date, required: true })
  apply_date: Date;
}

export const ApplySchema = SchemaFactory.createForClass(Apply);
ApplySchema.index({ id_student: 1, id_recruit: 1 }, { unique: true });
