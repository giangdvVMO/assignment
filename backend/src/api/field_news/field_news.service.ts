import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFieldNewDto } from './dto/create-field_new.dto';
import { UpdateFieldNewDto } from './dto/update-field_new.dto';
import { FieldNews, FieldNewsDocument } from './field_new.schema';

@Injectable()
export class FieldNewsService {
  constructor(
    @InjectModel(FieldNews.name)
    private readonly FieldNewsModel: Model<FieldNewsDocument>,
  ) {}
  async create(data: CreateFieldNewDto) {
    //delete manucompany
    await this.FieldNewsModel.deleteMany({
      id_news: data.id_news,
    });
    console.log('data', data.fields);
    //map array
    const dataArray = data.fields.map((id_field) => {
      return { id_news: data.id_news, id_field };
    });
    //insert
    const result = await this.FieldNewsModel.insertMany(dataArray);
    return {
      data: result,
    };
  }

  findAll() {
    return `This action returns all fieldNews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldNew`;
  }

  update(id: number, updateFieldNewDto: UpdateFieldNewDto) {
    return `This action updates a #${id} fieldNew`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldNew`;
  }
}
