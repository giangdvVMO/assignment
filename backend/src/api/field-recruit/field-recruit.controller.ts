import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FieldRecruitService } from './field-recruit.service';
import { CreateFieldRecruitArrayDto } from './dto/create-field-recruit.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('field-recruit')
@ApiTags('Field-Recruit')
export class FieldRecruitController {
  constructor(private readonly fieldRecruitService: FieldRecruitService) {}

  @Post()
  create(@Body() createFieldRecruitDto: CreateFieldRecruitArrayDto) {
    return this.fieldRecruitService.createMany(createFieldRecruitDto);
  }

  @Get()
  findAll() {
    return this.fieldRecruitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.fieldRecruitService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.fieldRecruitService.remove(+id);
  }
}
