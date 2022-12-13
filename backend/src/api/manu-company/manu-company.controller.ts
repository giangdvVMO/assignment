import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ManuCompanyService } from './manu-company.service';
import { CreateManuCompanyArrayDto } from './dto/create-manu-company.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: ['1'],
  path: 'manu-company',
})
@ApiTags('Manu-Company')
export class ManuCompanyController {
  constructor(private readonly manuCompanyService: ManuCompanyService) {}

  @Post()
  create(@Body() createManuCompanyArrayDto: CreateManuCompanyArrayDto) {
    return this.manuCompanyService.create(createManuCompanyArrayDto);
  }

  @Get()
  findAll() {
    return this.manuCompanyService.findAll();
  }

  @Get('company/:id')
  findAllCompanyManu(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.manuCompanyService.findAllCompanyManu(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.manuCompanyService.findOne(+id);
  }
}
