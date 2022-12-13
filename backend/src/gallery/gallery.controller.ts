import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import {
  CreateGalleryDto,
  CreateGalleryFileDto,
} from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller({
  version: ['1'],
  path: 'gallery',
})
@ApiTags('Gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req: any, file: any, cb: any) => {
          // Calling the callback passing the random name generated with the original extension name
          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'create image',
    type: CreateGalleryFileDto,
  })
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    // const { file_cv } = createCvDto;
    return this.galleryService.create(+createGalleryDto.id_account, image);
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id_account')
  findAllByAccount(@Param('id_account') id_account: string) {
    try {
      const result = parseInt(id_account);
    } catch (err) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.galleryService.findAllByAccount(+id_account);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(+id, updateGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(+id);
  }
}
