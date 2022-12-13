import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({
  collection: 'tbl_gallery',
})
export class Gallery {
  @Prop({ type: String, required: true })
  link: string;

  @Prop({ type: Number, required: true, ref: 'tbl_account' })
  id_account: number;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
