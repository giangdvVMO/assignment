import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRecruitViewDto } from './dto/create-recruit-view.dto';
import { UpdateRecruitViewDto } from './dto/update-recruit-view.dto';
import { RecruitView, RecruitViewDocument } from './recruit-view.schema';

@Injectable()
export class RecruitViewService {
  constructor(
    @InjectModel(RecruitView.name)
    private readonly recruitViewModel: Model<RecruitViewDocument>,
  ) {}

  // create if new and update if exist
  async create(createRecruitViewDto: CreateRecruitViewDto) {
    const { id_student, id_recruit } = createRecruitViewDto;
    const currentView = await this.findOneCondition(id_student, id_recruit);
    let result;
    if (!currentView) {
      result = await this.recruitViewModel.create({
        id_recruit,
        id_student,
        views: 1,
      });
    } else {
      result = await this.recruitViewModel.updateOne(
        {
          id_recruit,
          id_student,
        },
        {
          views: currentView.views + 1,
        },
      );
    }
    return { data: result };
  }

  findAll() {
    return `This action returns all recruitView`;
  }

  //thống kê lượt xem và người xem bài đăng
  async findAllByRecruit(id_recruit: number) {
    console.log('id', id_recruit);
    const result = await this.recruitViewModel.aggregate([
      {
        $match: {
          id_recruit: +id_recruit,
        },
      },
      {
        $lookup: {
          from: 'tbl_student',
          localField: 'id_student',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: '$student',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'student.id_account',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $group: {
          _id: '$id_recruit',
          count: {
            $sum: '$views',
          },
          views: {
            $push: '$$ROOT',
          },
        },
      },
    ]);
    return { data: result };
  }

  async findOneCondition(id_student: number, id_recruit: number) {
    const result = await this.recruitViewModel.aggregate([
      {
        $match: {
          id_student: id_student,
          id_recruit: id_recruit,
        },
      },
    ]);
    return result[0];
  }

  findOne(id: number) {
    return `This action returns a #${id} recruitView`;
  }

  update(id: number, updateRecruitViewDto: UpdateRecruitViewDto) {
    return `This action updates a #${id} recruitView`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruitView`;
  }
}
