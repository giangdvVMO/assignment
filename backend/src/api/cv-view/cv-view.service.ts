import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CvView, CvViewDocument } from './cv-view.schema';
import { CreateCvViewDto } from './dto/create-cv-view.dto';
import { UpdateCvViewDto } from './dto/update-cv-view.dto';

@Injectable()
export class CvViewService {
  constructor(
    @InjectModel(CvView.name)
    private readonly cvViewModel: Model<CvViewDocument>,
  ) {}
  async create(createcvViewDto: CreateCvViewDto) {
    const { id_company, id_cv } = createcvViewDto;
    const currentView = await this.findOneCondition(id_company, id_cv);
    let result;
    if (!currentView) {
      result = await this.cvViewModel.create({
        id_cv,
        id_company,
        views: 1,
      });
    } else {
      result = await this.cvViewModel.updateOne(
        {
          id_cv,
          id_company,
        },
        {
          views: currentView.views + 1,
        },
      );
    }
    return { data: result };
  }

  findAll() {
    return `This action returns all cvView`;
  }

  async findAllByCv(id_cv: number) {
    console.log('id', id_cv);
    const result = await this.cvViewModel.aggregate([
      {
        $match: {
          id_cv: +id_cv,
        },
      },
      { $sort: { views: -1 } },
      {
        $lookup: {
          from: 'tbl_company',
          localField: 'id_company',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: '$company',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'company.id_account',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $group: {
          _id: '$id_cv',
          count: {
            $sum: '$views',
          },
          views: {
            $push: '$$ROOT',
          },
        },
      },
    ]);
    console.log(result[0]);
    return { data: !result.length ? { views: [], count: 0 } : result[0] };
  }

  async findOneCondition(id_company: number, id_cv: number) {
    const result = await this.cvViewModel.aggregate([
      {
        $match: {
          id_company: id_company,
          id_cv: id_cv,
        },
      },
    ]);
    return result[0];
  }
  update(id: number, updateCvViewDto: UpdateCvViewDto) {
    return `This action updates a #${id} cvView`;
  }

  remove(id: number) {
    return `This action removes a #${id} cvView`;
  }
}
