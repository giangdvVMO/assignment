import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountNoti, AccountNotiDocument } from './account_noti.schema';
import {
  CreateAccNotiArrayDto,
  CreateAccountNotiDto,
} from './dto/create-account_noti.dto';
import { UpdateAccountNotiDto } from './dto/update-account_noti.dto';

@Injectable()
export class AccountNotiService {
  constructor(
    @InjectModel(AccountNoti.name)
    private readonly accountNotiModel: Model<AccountNotiDocument>,
  ) {}
  async bulkCreate(createAccountNotiDto: CreateAccountNotiDto) {
    const list = createAccountNotiDto.receive_id.map((acc) => {
      const account = {
        id_account: acc,
        id_noti: createAccountNotiDto.id_noti,
        position: 'receiver',
      } as AccountNotiDocument;
      return account;
    });
    const sendAccount = {
      id_account: createAccountNotiDto.send_id,
      id_noti: createAccountNotiDto.id_noti,
      position: 'sender',
    } as AccountNotiDocument;
    list.push(sendAccount);
    console.log('list', list);
    const result = await this.accountNotiModel.insertMany(list);
    console.log('resultx', result);
    return result;
  }

  create(createAccNotiArrayDto: CreateAccNotiArrayDto) {
    return '';
  }

  findAll() {
    return `This action returns all accountNoti`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accountNoti`;
  }

  update(id: number, updateAccountNotiDto: UpdateAccountNotiDto) {
    return `This action updates a #${id} accountNoti`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountNoti`;
  }
}
