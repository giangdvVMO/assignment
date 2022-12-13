import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

import { CvService } from './cv.service';
import { CreateCvDto, FileCreateCVDto } from './dto/create-cv.dto';
import { QueryParamCVDto } from './dto/query-param-cv.dto';
import { FileUpdateCVDto, UpdateCvDto } from './dto/update-cv.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller({
  version: ['1'],
  path: 'cv',
})
@ApiTags('CV')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file_cv', {
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
    description: 'create CV',
    type: FileCreateCVDto,
  })
  create(
    @Body() createCvDto: CreateCvDto,
    @UploadedFile() file_cv: Express.Multer.File,
  ) {
    // const { file_cv } = createCvDto;
    return this.cvService.create(createCvDto, file_cv);
  }

  @Get()
  findAll(@Query() query: QueryParamCVDto) {
    return this.cvService.findAll(query);
  }

  @Get('suggest/:id_company')
  hint(@Param('id_company') param: string, @Query() query: QueryParamCVDto) {
    if (!parseInt(param)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.cvService.suggest(+param, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file_cv', {
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
    description: 'create CV',
    type: FileUpdateCVDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @UploadedFile() file_cv?: Express.Multer.File,
  ) {
    console.log('updateCvDto', updateCvDto);
    if (file_cv) {
      return this.cvService.update(+id, updateCvDto, file_cv);
    }
    return this.cvService.update(+id, updateCvDto);
  }
}
