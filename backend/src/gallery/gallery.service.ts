import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Gallery, GalleryDocument } from './gallery.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,
  ) {}
  async create(id_account: number, image: Express.Multer.File) {
    const path = image.path.split('\\');
    const link = `${path[1]}/${path[2]}`;
    // return;
    const resultCreate = await this.galleryModel.create({ id_account, link });
    console.log(resultCreate);
    return { data: resultCreate };
  }

  findAll() {
    return `This action returns all gallery`;
  }

  async findAllByAccount(id_account: number) {
    const result = await this.galleryModel.aggregate([
      {
        $match: {
          id_account: id_account,
        },
      },
    ]);
    return { data: result };
  }

  findOne(id: number) {
    return `This action returns a #${id} gallery`;
  }

  update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`;
  }
}
