import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { ApplyService } from '../apply/apply.service';
import { LetterService } from '../letter/letter.service';
import { ConfirmDto, CreateRateDto } from './dto/create-rate.dto';
import { QueryDto } from './dto/query.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { Rate, RateDocument } from './rate.schema';

@Injectable()
export class RateService {
  constructor(
    @InjectModel(Rate.name) private readonly rateModel: Model<RateDocument>,
    private readonly applyService: ApplyService,
    private readonly letterService: LetterService,
  ) {}

  async calculateId() {
    //create id
    const count: any = await this.rateModel.aggregate([
      {
        $group: {
          _id: null,
          max: {
            $max: '$_id',
          },
        },
      },
    ]);
    return count.length ? count[0].max + 1 : 1;
  }

  async create(createRateDto: CreateRateDto) {
    const _id = await this.calculateId();
    const result = await this.rateModel.create({
      ...createRateDto,
      _id,
      create_date: moment().utc(true)
    });
    return { data: result };
  }

  async findPreCondition(id_student: number, id_company: number) {
    const apply = await this.applyService.findCondition({
      id_student,
      id_company,
    });
    const letter = await this.letterService.findCondition({
      id_student,
      id_company,
    });
    if (apply.data.length && letter.data.length) {
      return { data: true };
    }
    return { data: false };
  }

  async confirm(id: number, confirmDto: ConfirmDto) {
    const result = await this.rateModel.updateOne(
      { _id: id },
      { ...confirmDto, confirm_date: moment().utc(true), status: true },
    );
    if (result.modifiedCount) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }

  async findAll(query: QueryDto) {
    const {
      pageIndex,
      pageSize,
      sortBy,
      sortOrder,
      search,
      status,
      id_student,
      id_company,
      type_rate,
    } = query;
    const condition = {};

    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search ? search : '');

    if (status === '1') {
      condition['status'] = true;
    }
    if (status === '0') {
      condition['status'] = false;
    }

    if (id_company) {
      condition['id_company'] = +id_company;
    }
    if (id_student) {
      condition['id_student'] = +id_student;
    }
    if (type_rate) {
      condition['type_rate'] = type_rate;
    }
    let limitSkip = [];
    if (pageIndex && pageSize) {
      limitSkip = [
        {
          $skip: (+pageIndex - 1) * +pageSize,
        },
        {
          $limit: +pageSize,
        },
      ];
    }

    const rateList = await this.rateModel.aggregate([
      //account not delete
      {
        $match: {
          ...condition,
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
          localField: 'student._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'company._id',
          foreignField: '_id',
          as: 'account_company',
        },
      },
      {
        $unwind: '$account_company',
      },
      {
        $addFields: {
          //search
          result: {
            $or: [
              {
                $regexMatch: {
                  input: '$title',
                  regex: searchRgx,
                  options: 'i',
                },
              },
              {
                $regexMatch: {
                  input: '$content',
                  regex: searchRgx,
                  options: 'i',
                },
              },
            ],
          },
        },
      },
      {
        $match: {
          result: true,
        },
      },
      ...limitSkip,
    ]);
    return { data: rateList };
  }

  findOne(id: number) {
    return `This action returns a #${id} rate`;
  }

  update(id: number, updateRateDto: UpdateRateDto) {
    return `This action updates a #${id} rate`;
  }

  async remove(id: number) {
    const result = await this.rateModel.deleteOne({ _id: id });
    return result;
  }
}
