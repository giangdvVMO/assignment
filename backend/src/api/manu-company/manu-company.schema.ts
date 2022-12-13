import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ManuCompanyDocument = ManuCompany & Document;

@Schema({
  collection: 'tbl_manu_company',
})
export class ManuCompany {
  @Prop({ type: Number, required: true })
  id_company: number;

  @Prop({ type: Number, required: true })
  id_manu: number;
}

export const ManuCompanySchema = SchemaFactory.createForClass(ManuCompany);
ManuCompanySchema.index({ id_company: 1, id_manu: 1 }, { unique: true });
