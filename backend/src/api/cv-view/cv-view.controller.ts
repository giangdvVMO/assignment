import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CvViewService } from './cv-view.service';
import { CreateCvViewDto } from './dto/create-cv-view.dto';
import { UpdateCvViewDto } from './dto/update-cv-view.dto';

@Controller({
  version: ['1'],
  path: 'cv-view',
})
@ApiTags('cv View')
export class CvViewController {
  constructor(private readonly cvViewService: CvViewService) {}

  @Post()
  create(@Body() createCvViewDto: CreateCvViewDto) {
    return this.cvViewService.create(createCvViewDto);
  }

  @Get()
  findAll() {
    return this.cvViewService.findAll();
  }

  @Get('list/:id')
  findAllByRecruit(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.cvViewService.findAllByCv(+id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cvViewService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvViewDto: UpdateCvViewDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.cvViewService.update(+id, updateCvViewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.cvViewService.remove(+id);
  }
}
