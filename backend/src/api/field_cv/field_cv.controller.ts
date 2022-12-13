import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FieldCvService } from './field_cv.service';
import { CreateFieldCvDto } from './dto/create-field_cv.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: ['1'],
  path: 'field-cv',
})
@ApiTags('Field-CV')
export class FieldCvController {
  constructor(private readonly fieldCvService: FieldCvService) {}

  @Post()
  create(@Body() createFieldCvDto: CreateFieldCvDto) {
    return this.fieldCvService.create(createFieldCvDto);
  }

  @Get()
  findAll() {
    return this.fieldCvService.findAll();
  }

  @Get('cv/:id')
  findAllCompanyManu(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.fieldCvService.findAllFieldCV(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.fieldCvService.findOne(+id);
  }
}
