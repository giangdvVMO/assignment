import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecruitViewDocument = RecruitView & Document;

@Schema({
  collection: 'tbl_recruit_view',
})
export class RecruitView {
  @Prop({ type: Number, ref: 'tbl_recruit' })
  id_recruit: number;

  @Prop({ type: Number, ref: 'tbl_student' })
  id_student: number;

  @Prop({ type: Number, default: 0 })
  views: number;
}

export const RecruitViewSchema = SchemaFactory.createForClass(RecruitView);
RecruitViewSchema.index({ id_student: 1, id_recruit: 1 }, { unique: true });
