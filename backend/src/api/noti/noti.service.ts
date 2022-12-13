import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountNotiService } from '../account_noti/account_noti.service';
import { CreateNotiDto } from './dto/create-noti.dto';
import { UpdateNotiDto } from './dto/update-noti.dto';
import { Noti, NotiDocument } from './noti.schema';
import * as moment from 'moment'

@Injectable()
export class NotiService {
  constructor(
    @InjectModel(Noti.name)
    private readonly notiModel: Model<NotiDocument>,
    private readonly accountNotiService: AccountNotiService,
  ) {}
  async create(createNotiDto: CreateNotiDto) {
    const count: any = await this.notiModel.aggregate([
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
    const id = count.length ? count[0].max + 1 : 1;

    const result = await this.notiModel.create({
      _id: id,
      type: createNotiDto.type,
      title: createNotiDto.title,
      content: createNotiDto.content,
      link: createNotiDto.link,
      create_date: moment().utc(true),
    });
    console.log('result', result);
    if (result) {
      const createAccountNotiDto = {
        id_noti: id,
        send_id: createNotiDto.send_id,
        receive_id: createNotiDto.receive_id,
        create_date: moment().utc(true),
      };
      const resultMany = await this.accountNotiService.bulkCreate(
        createAccountNotiDto,
      );
      console.log('resultMany', resultMany);
    }
    return result;
  }

  findAll() {
    return `This action returns all noti`;
  }

  findOne(id: number) {
    return `This action returns a #${id} noti`;
  }

  update(id: number, updateNotiDto: UpdateNotiDto) {
    return `This action updates a #${id} noti`;
  }

  remove(id: number) {
    return `This action removes a #${id} noti`;
  }

  async findAllAccount(account_id: number) {
    const result = await this.notiModel.aggregate([
      {
        $lookup: {
          from: 'tbl_account_noti',
          localField: '_id',
          foreignField: 'id_noti',
          as: 'account_noti',
        },
      },
      {
        $unwind: '$account_noti',
      },
      {
        $match: {
          'account_noti.id_account': +account_id,
          'account_noti.position': 'receiver',
        },
      },
      {
        $sort: {
          create_date: -1,
        },
      },
    ]);
    return { data: result };
  }

  async findAllAccountReceive(account_id: number) {
    const result = await this.notiModel.aggregate([
      {
        $lookup: {
          from: 'tbl_account_noti',
          localField: '_id',
          foreignField: 'id_noti',
          as: 'account_noti',
        },
      },
      {
        $unwind: '$account_noti',
      },
      {
        $match: {
          'account_noti.id_account': +account_id,
        },
      },
    ]);
    return { data: result };
  }
}
