import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateManufactureArrayDto,
  CreateManufactureDto,
} from './dto/create-manufacture.dto';
import { Manufacture, ManufactureDocument } from './manufacture.schema';

@Injectable()
export class ManufactureService {
  constructor(
    @InjectModel(Manufacture.name)
    private readonly manufactureModel: Model<ManufactureDocument>,
  ) {}
  async create(createManufactureDto: CreateManufactureDto) {
    const result = await this.manufactureModel.create(createManufactureDto);
    return {
      data: result,
    };
  }

  async createMany(createManufactureArrayDto: CreateManufactureArrayDto) {
    console.log('createManufactureArrayDto', createManufactureArrayDto);
    const result = await this.manufactureModel.insertMany(
      createManufactureArrayDto.array,
    );
    return {
      data: result,
    };
  }

  async findAll() {
    const result = await this.manufactureModel.find();
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }

  async findOne(id: number) {
    const result = await this.manufactureModel.find({ _id: id });
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }
}
