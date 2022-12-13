import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({
  collection: 'tbl_news',
})
export class News {
  @Prop()
  _id: number;

  @Prop({ type: String, maxlength: 50, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, maxlength: 1000, required: true })
  thumnail: string;

  @Prop({ type: Number })
  views: number;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: Number, ref: 'tbl_account', required: true })
  id_account: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  confirm_id: number;

  @Prop({ type: Number, ref: 'tbl_account' })
  delete_id: number;

  @Prop({ type: Date, required: true })
  create_date: Date;

  @Prop({ type: Date, default: null })
  confirm_date: Date;

  @Prop({ type: Date, default: null })
  delete_date: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
