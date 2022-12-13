import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFieldRecruitArrayDto } from './dto/create-field-recruit.dto';
import { FieldRecruit, FieldRecruitDocument } from './field.schema';

@Injectable()
export class FieldRecruitService {
  constructor(
    @InjectModel(FieldRecruit.name)
    private readonly fieldRecruitModel: Model<FieldRecruitDocument>,
  ) {}
  async createMany(data: CreateFieldRecruitArrayDto) {
    //delete FieldRecruit
    await this.fieldRecruitModel.deleteMany({
      id_recruit: data.id_recruit,
    });
    //map array
    const dataArray = data.id_field_array.map((id_field) => {
      return { id_recruit: data.id_recruit, id_field };
    });
    //insert
    const result = await this.fieldRecruitModel.insertMany(dataArray);
    return {
      data: result,
    };
  }

  findAll() {
    return `This action returns all fieldRecruit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldRecruit`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldRecruit`;
  }
}
