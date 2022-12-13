import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldArrayDto, CreateFieldDto } from './dto/create-field.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('field')
@ApiTags('Field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldService.create(createFieldDto);
  }

  @Post('list')
  createMany(@Body() createFieldArrayDto: CreateFieldArrayDto) {
    console.log(createFieldArrayDto);
    return this.fieldService.createMany(createFieldArrayDto);
  }

  @Get()
  findAll() {
    return this.fieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.fieldService.findOne(+id);
  }
}
