import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { ConfirmDto, CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryDto } from './dto/query.dto';

@Controller({
  version: ['1'],
  path: 'rate',
})
@ApiTags('Rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  create(@Body() createRateDto: CreateRateDto) {
    return this.rateService.create(createRateDto);
  }

  @Get('precondition')
  findPreCondition(@Query() query: QueryDto) {
    const { id_student, id_company } = query;
    return this.rateService.findPreCondition(+id_student, +id_company);
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.rateService.findAll(query);
  }

  @Patch('confirm/:id')
  confirm(@Param('id') id: string, @Body() confirmDto: ConfirmDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.rateService.confirm(+id, confirmDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.rateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.rateService.update(+id, updateRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.rateService.remove(+id);
  }
}
