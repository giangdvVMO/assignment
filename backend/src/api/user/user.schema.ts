import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RoleEnum, StatusEnum } from 'src/share/common/enum';
import { maxLengthPhone } from 'src/share/common/constanst';
import * as moment from 'moment';

export type UserDocument = User & Document;

@Schema({
  collection: 'tbl_account',
})
export class User {
  @Prop()
  _id: number;

  @Prop({ type: String, unique: true, required: true })
  username: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  fullname: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String, required: true })
  birthday: Date;

  @Prop({ type: String, enum: RoleEnum, required: true })
  role: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: String, maxlength: maxLengthPhone })
  phone: string;

  @Prop({ type: Date, default: moment().utc(true), required: true })
  create_date: Date;

  @Prop({ type: Date, default: null })
  update_date: Date;

  @Prop({ type: Date, default: null })
  delete_date: Date;

  @Prop({ type: String, default: null })
  socket_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
// UserSchema.index({ email: 1, username: 1 }, { unique: true });
