import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ManufactureService } from './manufacture.service';
import {
  CreateManufactureArrayDto,
  CreateManufactureDto,
} from './dto/create-manufacture.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: ['1'],
  path: 'manufacture',
})
@ApiTags('Manufacture')
export class ManufactureController {
  constructor(private readonly manufactureService: ManufactureService) {}

  @Post()
  create(@Body() createManufactureDto: CreateManufactureDto) {
    return this.manufactureService.create(createManufactureDto);
  }

  @Post('/list')
  createMany(@Body() createManufactureArrayDto: CreateManufactureArrayDto) {
    console.log('createManufactureArrayDto', createManufactureArrayDto);
    return this.manufactureService.createMany(createManufactureArrayDto);
  }

  @Get()
  findAll() {
    return this.manufactureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manufactureService.findOne(+id);
  }
}
