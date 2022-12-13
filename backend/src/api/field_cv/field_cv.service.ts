import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFieldCvDto } from './dto/create-field_cv.dto';
import { FieldCV, FieldCVDocument } from './field_cv.schema';

@Injectable()
export class FieldCvService {
  constructor(
    @InjectModel(FieldCV.name)
    private readonly fieldCVModel: Model<FieldCVDocument>,
  ) {}
  async create(data: CreateFieldCvDto) {
    //delete manucompany
    await this.fieldCVModel.deleteMany({
      id_cv: data.id_cv,
    });
    console.log('data', data.fields);
    //map array
    const dataArray = data.fields.map((id_field) => {
      return { id_cv: data.id_cv, id_field };
    });
    //insert
    const result = await this.fieldCVModel.insertMany(dataArray);
    return {
      data: result,
    };
  }

  async findAll() {
    const result = await this.fieldCVModel.find();
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }

  async findAllFieldCV(idCV: number) {
    const result = await this.fieldCVModel.aggregate([
      {
        $match: {
          id_cv: idCV,
        },
      },
      {
        $lookup: {
          from: 'tbl_field',
          localField: 'id_field',
          foreignField: '_id',
          as: 'field',
        },
      },
    ]);
    if (result.length) {
      const field = result.map((item) => {
        return {
          ...item.field[0],
        };
      });
      return {
        data: {
          id_company: result[0].id_cv,
          field,
        },
      };
    } else {
      return { data: 'empty' };
    }
  }

  async findOne(id: number) {
    const result = await this.fieldCVModel.find({ _id: id });
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }
}
