import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateManuCompanyArrayDto } from './dto/create-manu-company.dto';
import { ManuCompany, ManuCompanyDocument } from './manu-company.schema';

@Injectable()
export class ManuCompanyService {
  constructor(
    @InjectModel(ManuCompany.name)
    private readonly ManuCompanyModel: Model<ManuCompanyDocument>,
  ) {}
  async create(data: CreateManuCompanyArrayDto) {
    //delete manucompany
    await this.ManuCompanyModel.deleteMany({
      id_company: data.id_company,
    });
    //map array
    const dataArray = data.id_manu_array.map((id_manu) => {
      return { id_company: data.id_company, id_manu };
    });
    //insert
    const result = await this.ManuCompanyModel.insertMany(dataArray);
    return {
      data: result,
    };
  }

  async findAll() {
    const result = await this.ManuCompanyModel.find();
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }

  async findAllCompanyManu(idCompany: number) {
    const result = await this.ManuCompanyModel.aggregate([
      {
        $match: {
          id_company: idCompany,
        },
      },
      {
        $lookup: {
          from: 'tbl_manufacture',
          localField: 'id_manu',
          foreignField: '_id',
          as: 'manufacture',
        },
      },
    ]);
    if (result.length) {
      const manufacture = result.map((item) => {
        return {
          ...item.manufacture[0],
        };
      });
      return {
        data: {
          id_company: result[0].id_company,
          manufacture,
        },
      };
    } else {
      return { data: 'empty' };
    }
  }

  async findNameManu(id_company: number) {
    const result = await this.ManuCompanyModel.aggregate([
      {
        $match: {
          id_company: id_company,
        },
      },
      {
        $lookup: {
          from: 'tbl_manufacture',
          localField: 'id_manu',
          foreignField: '_id',
          as: 'manufacture',
        },
      },
      {
        $unwind: '$manufacture',
      },
      {
        $group: {
          _id: '$id_company',
          manufacture: {
            $push: '$manufacture.name_manu',
          },
        },
      },
    ]);
    // console.log(result);
    return result[0].manufacture;
  }

  async findOne(id: number) {
    const result = await this.ManuCompanyModel.find({ _id: id });
    if (result.length) {
      return { data: result };
    } else {
      return { data: 'empty' };
    }
  }
}
