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
import { RecruitViewService } from './recruit-view.service';
import { CreateRecruitViewDto } from './dto/create-recruit-view.dto';
import { UpdateRecruitViewDto } from './dto/update-recruit-view.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: ['1'],
  path: 'recruit-view',
})
@ApiTags('Recruit View')
export class RecruitViewController {
  constructor(private readonly recruitViewService: RecruitViewService) {}

  @Post()
  create(@Body() createRecruitViewDto: CreateRecruitViewDto) {
    return this.recruitViewService.create(createRecruitViewDto);
  }

  @Get()
  findAll() {
    return this.recruitViewService.findAll();
  }

  @Get('list/:id')
  findAllByRecruit(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitViewService.findAllByRecruit(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitViewService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRecruitViewDto: UpdateRecruitViewDto) {
  //   return this.recruitViewService.update(+id, updateRecruitViewDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitViewService.remove(+id);
  }
}
