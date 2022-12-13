import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FieldNewsService } from '../field_news/field_news.service';
import { ConfirmNewsDto, CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News, NewsDocument } from './news.schema';
import * as moment from 'moment';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
    private readonly fieldNewsService: FieldNewsService,
  ) {}

  async calculateId() {
    //create id
    const count: any = await this.newsModel.aggregate([
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

  async create(createNewsDto: CreateNewsDto) {
    const { title, id_account, thumnail, content, status, fields } =
      createNewsDto;
    const dataCreate: any = {
      title,
      id_account: +id_account,
      thumnail,
      status: status,
      content,
      _id: await this.calculateId(),
      create_date: moment().utc(true),
      views: 0,
    };

    const resultCreate = await this.newsModel.create(dataCreate);
    // const fieldsArray = fields.split(',');
    const fieldsNumber = fields.map((field) => {
      return +field;
    });
    const dataCreateFieldCV = { id_news: dataCreate._id, fields: fieldsNumber };
    await this.fieldNewsService.create(dataCreateFieldCV);
    return resultCreate;
  }

  async confirm(id: number, confirmDto: ConfirmNewsDto) {
    const result = await this.newsModel.updateOne(
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

  async findAll(query) {
    const {
      field,
      status,
      search,
      id_account,
      sort,
      pageIndex,
      pageSize,
      except_id,
    } = query;

    console.log('field', field);
    const condition = {};
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search ? search : '');
    if (status === '1') {
      condition['status'] = true;
    }
    if (status === '0') {
      condition['status'] = false;
    }
    if (id_account) {
      condition['id_account'] = +id_account;
    }
    if (except_id) {
      condition['_id'] = { $not: { $eq: +except_id } };
    }
    let sort_order: any = { $sort: { create_date: -1 } };

    if (sort) {
      const name_sort = sort.split(',');
      const object = {};
      name_sort.forEach((order) => {
        object[order] = -1;
      });
      sort_order = { $sort: object };
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
    const newsList = await this.newsModel.aggregate([
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'id_account',
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
      // //add field
      {
        $lookup: {
          from: 'tbl_field_news',
          localField: '_id',
          foreignField: 'id_news',
          as: 'field_news',
          pipeline: [
            {
              $group: {
                _id: '$id_news',
                id_fields: {
                  $push: '$id_field',
                },
              },
            },
          ],
        },
      },
      {
        $unwind: '$field_news',
      },
      {
        $addFields: {
          //search
          result: {
            $regexMatch: {
              input: '$title',
              regex: searchRgx,
              options: 'i',
            },
          },
          id_fields: '$field_news.id_fields',
        },
      },
      {
        $addFields: {
          isfields: field_condition,
        },
      },
      {
        $match: {
          result: true,
          isfields: true,
          // isExperience: true,
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
        ...sort_order,
      },
      ...limitSkip,
    ]);

    return { data: newsList };
  }

  async findOne(id: number) {
    const result = await this.newsModel.aggregate([
      {
        $lookup: {
          from: 'tbl_account',
          localField: 'id_account',
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
          _id: id,
        },
      },
      // //add field
      {
        $lookup: {
          from: 'tbl_field_news',
          localField: '_id',
          foreignField: 'id_news',
          as: 'field_news',
          pipeline: [
            {
              $group: {
                _id: '$id_news',
                id_fields: {
                  $push: '$id_field',
                },
              },
            },
          ],
        },
      },
      {
        $unwind: '$field_news',
      },
      {
        $addFields: {
          id_fields: '$field_news.id_fields',
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
    ]);

    return { data: result[0] };
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  async view(id: number) {
    const data = await this.newsModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
    ]);
    if (!data.length) {
      throw new BadRequestException('Mã bài đăng không tồn tại');
      return;
    }
    console.log('views', data[0].views);
    const result = await this.newsModel.updateOne(
      { _id: id },
      { views: data[0].views ? data[0].views + 1 : 1 },
    );
    if (result.modifiedCount) {
      return { data: 'success' };
    } else {
      return { data: 'failure' };
    }
  }

  async remove(id: number, data: number) {
    const delete_date = moment().utc(true);
    const result = await this.newsModel.updateOne(
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
}
