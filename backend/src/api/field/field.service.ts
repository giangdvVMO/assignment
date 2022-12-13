import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFieldArrayDto, CreateFieldDto } from './dto/create-field.dto';
import { Field, FieldDocument } from './field.schema';

@Injectable()
export class FieldService {
  constructor(
    @InjectModel(Field.name)
    private readonly fieldModel: Model<FieldDocument>,
  ) {}

  async create(createFieldDto: CreateFieldDto) {
    const result = await this.fieldModel.create(createFieldDto);
    return {
      data: result,
    };
  }

  async createMany(createFieldArrayDto: CreateFieldArrayDto) {
    const result = await this.fieldModel.insertMany(
      createFieldArrayDto.field_array,
    );
    return {
      data: result,
    };
  }

  async findAll() {
    const result = await this.fieldModel.find();
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }
  async findOne(id: number) {
    const result = await this.fieldModel.find({ _id: id });
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }
}
