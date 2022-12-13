import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import { ConditionLetterDto, CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: ['1'],
  path: 'letter',
})
@ApiTags('Letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  create(@Body() createLetterDto: CreateLetterDto) {
    return this.letterService.create(createLetterDto);
  }

  @Get()
  findAll() {
    return this.letterService.findAll();
  }

  @Get('condition')
  findCondition(@Query() conditionLetterDto: ConditionLetterDto) {
    return this.letterService.findCondition(conditionLetterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.letterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLetterDto: UpdateLetterDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.letterService.update(+id, updateLetterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.letterService.remove(+id);
  }
}
