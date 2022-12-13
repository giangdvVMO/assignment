import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { FieldRecruitService } from '../field-recruit/field-recruit.service';
import { ConfirmRecruitDto } from './dto/confirm-recruit.dto';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { QueryParamRecruitDto } from './dto/query-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { Recruit, RecruitDocument } from './recruit.schema';

@Injectable()
export class RecruitService {
  constructor(
    @InjectModel(Recruit.name)
    private readonly recruitModel: Model<RecruitDocument>,
    private readonly fieldRecruitService: FieldRecruitService,
  ) {}
  async calculateId() {
    //create id
    const count: any = await this.recruitModel.aggregate([
      {
        $group: {
          _id: null,
          max: {
            $max: '$_id',
          },
        },
      },
    ]);
    console.log(count);
    return count.length ? count[0].max + 1 : 1;
  }
  async create(createRecruitDto: CreateRecruitDto) {
    const _id = await this.calculateId();
    console.log('_id', _id);
    const result = await this.recruitModel.create({
      ...createRecruitDto,
      _id: _id,
      create_date: moment().utc(true),
    });
    const createFieldRecruitDto = {
      id_recruit: _id,
      id_field_array: createRecruitDto.fields,
    };
    const createField = await this.fieldRecruitService.createMany(
      createFieldRecruitDto,
    );
    return result;
  }

  async findOne(id: number) {
    const data = await this.recruitModel.aggregate([
      {
        $match: {
          _id: id,
        },
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
          localField: 'company._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $lookup: {
          from: 'tbl_field_recruit',
          localField: '_id',
          foreignField: 'id_recruit',
          as: 'field_recruit',
        },
      },
      {
        $lookup: {
          from: 'tbl_field',
          localField: 'field_recruit.id_field',
          foreignField: '_id',
          as: 'fields',
        },
      },
    ]);
    return { data: data[0] };
  }

  async update(id: number, updateRecruitDto: UpdateRecruitDto) {
    const result = await this.recruitModel.updateOne();
    // const createField = await this.fieldRecruitService.createMany(
    //   // updateRecruitDto,
    // );
    return `This action updates a #${id} recruit`;
  }

  async remove(id: number, data: number) {
    const delete_date = moment().utc(true);
    const result = await this.recruitModel.updateOne(
      { _id: id },
      { delete_date, delete_id: data },
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

  async confirm(id: number, confirmDto: ConfirmRecruitDto) {
    const result = await this.recruitModel.updateOne(
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

  async statistic() {
    const accept = await this.recruitModel.aggregate([
      {
        $match: {
          status: true,
        },
      },
      {
        $count: 'total',
      },
    ]);

    const unaccept = await this.recruitModel.aggregate([
      {
        $match: {
          status: false,
        },
      },
      {
        $count: 'total',
      },
    ]);
    return {
      data: {
        accept: accept[0] ? accept[0].total : 0,
        unaccept: unaccept[0] ? unaccept[0].total : 0,
      },
    };
  }

  async findAll(query: QueryParamRecruitDto) {
    const {
      field,
      status,
      search,
      id_company,
      experience,
      pageIndex,
      pageSize,
      salary,
      date,
    } = query;
    console.log('field', field);
    console.log('status', status);
    console.log('search', search);
    console.log('pageIndex', pageIndex);
    console.log('pageSize', pageSize);
    console.log('id_company', id_company);
    console.log('experience', experience);
    // console.log('date', date);

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
    let isExpired: any = true;
    try {
      if (date) {
        const expired = new Date(date);
        isExpired = {
          $gte: ['$end_date', expired],
        };
      }
    } catch (error) {
      throw new BadRequestException('Ngày không hợp lệ (MM/DD/YYYY)');
    }

    let isExperience = {};
    switch (experience) {
      case '0': {
        isExperience = {
          $eq: ['$experience', 0],
        };
        break;
      }
      case '1': {
        isExperience = {
          $and: [{ $gt: ['$experience', 0] }, { $lt: ['$experience', 12] }],
        };
        break;
      }
      case '2': {
        isExperience = {
          $gte: ['$experience', 12],
        };
        break;
      }
      default: {
        isExperience = true;
        break;
      }
    }
    let isSalary: any = true;
    if (salary && +salary) {
      switch (+salary) {
        case 1: {
          isSalary = {
            $and: [{ $gte: ['$salary', 0] }, { $lt: ['$salary', 5000000] }],
          };
          break;
        }
        case 2: {
          isSalary = {
            $and: [
              { $gte: ['$salary', 5000000] },
              { $lt: ['$salary', 10000000] },
            ],
          };
          break;
        }
        case 3: {
          isSalary = {
            $gte: ['$salary', 10000000],
          };
          break;
        }
        default: {
          isSalary = true;
          break;
        }
      }
    }

    let field_condition: any = true;
    if (field && +field) {
      field_condition = { $in: [+field, '$id_fields'] };
    } else {
      if (field && field.length) {
        const field_array = field.split(',');
        const conditionOr = field_array.map((item) => {
          return { $in: [+item, '$id_fields'] };
        });
        field_condition = { $or: conditionOr };
      }
    }
    console.log('field_condition', field_condition);
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
    const recruitList = await this.recruitModel.aggregate([
      //account not delete
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
          localField: 'company._id',
          foreignField: '_id',
          as: 'account',
        },
      },
      {
        $unwind: '$account',
      },
      {
        $match: {
          'company.status': true,
          'account.delete_date': null,
          delete_date: null,
          ...condition,
        },
      },
      // add field
      {
        $lookup: {
          from: 'tbl_field_recruit',
          localField: '_id',
          foreignField: 'id_recruit',
          as: 'field_recruit',
          pipeline: [
            {
              $group: {
                _id: '$id_recruit',
                id_fields: {
                  $push: '$id_field',
                },
              },
            },
          ],
        },
      },
      {
        $unwind: '$field_recruit',
      },
      {
        $addFields: {
          //search
          result: {
            $or: [
              {
                $regexMatch: {
                  input: '$level',
                  regex: searchRgx,
                  options: 'i',
                },
              },
              {
                $regexMatch: {
                  input: '$way_working',
                  regex: searchRgx,
                  options: 'i',
                },
              },
              {
                $regexMatch: {
                  input: '$title',
                  regex: searchRgx,
                  options: 'i',
                },
              },
            ],
          },
          id_fields: '$field_recruit.id_fields',
        },
      },
      {
        $addFields: {
          isfields: field_condition,
          isExperience: isExperience,
          isExpired: isExpired,
          isSalary: isSalary,
        },
      },
      {
        $match: {
          result: true,
          isfields: true,
          isExperience: true,
          isSalary: true,
          isExpired: true,
        },
      },
      {
        $lookup: {
          from: 'tbl_field',
          localField: 'id_fields',
          foreignField: '_id',
          as: 'fields',
        },
      },
      ...limitSkip,
    ]);
    let total = 0;
    if (recruitList.length) {
      //calculate total
      const recruitListTotal = await this.recruitModel.aggregate([
        //account not delete
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
            localField: 'company._id',
            foreignField: '_id',
            as: 'account',
          },
        },
        {
          $unwind: '$account',
        },
        {
          $match: {
            'account.delete_date': null,
            delete_date: null,
            ...condition,
          },
        },
        //add field
        {
          $lookup: {
            from: 'tbl_field_recruit',
            localField: '_id',
            foreignField: 'id_recruit',
            as: 'field_recruit',
            pipeline: [
              {
                $group: {
                  _id: '$id_recruit',
                  id_fields: {
                    $push: '$id_field',
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: '$field_recruit',
        },
        {
          $addFields: {
            //search
            result: {
              $or: [
                {
                  $regexMatch: {
                    input: '$level',
                    regex: searchRgx,
                    options: 'i',
                  },
                },
                {
                  $regexMatch: {
                    input: '$way_working',
                    regex: searchRgx,
                    options: 'i',
                  },
                },
                {
                  $regexMatch: {
                    input: '$title',
                    regex: searchRgx,
                    options: 'i',
                  },
                },
              ],
            },
            id_fields: '$field_recruit.id_fields',
          },
        },
        {
          $addFields: {
            isfields: field_condition,
            isExperience: isExperience,
            isExpired: isExpired,
          },
        },
        {
          $match: {
            result: true,
            isfields: true,
            isExperience: true,
            isExpired: true,
          },
        },
        {
          $lookup: {
            from: 'tbl_field',
            localField: 'id_fields',
            foreignField: '_id',
            as: 'fields',
          },
        },
        {
          $count: 'total',
        },
      ]);
      total = recruitListTotal[0].total;
    }
    console.log(recruitList);
    return {
      data: recruitList,
      pageSize: +pageIndex,
      pageIndex: +pageSize,
      total: total,
    };
  }

  async statisticCompany(id_company: number) {
    const companyListTotal = await this.recruitModel.aggregate([
      //account not delete
      {
        $match: {
          id_company: id_company,
        },
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
          from: 'tbl_apply',
          localField: '_id',
          foreignField: 'id_recruit',
          as: 'apply',
          pipeline: [
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
                localField: 'student._id',
                foreignField: '_id',
                as: 'account',
              },
            },
            {
              $unwind: '$account',
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'tbl_recruit_view',
          localField: '_id',
          foreignField: 'id_recruit',
          as: 'views',
          pipeline: [
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
                localField: 'student._id',
                foreignField: '_id',
                as: 'account',
              },
            },
            {
              $unwind: '$account',
            },
          ],
        },
      },
      // {
      //   $unwind: '$a',
      // },
    ]);
    return { data: companyListTotal };
  }
}
