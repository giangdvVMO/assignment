import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplyService } from './apply.service';
import { ConditionDto, CreateApplyDto, QueryDto } from './dto/create-apply.dto';

@Controller({
  version: ['1'],
  path: 'apply',
})
@ApiTags('Apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post()
  create(@Body() createApplyDto: CreateApplyDto) {
    return this.applyService.create(createApplyDto);
  }

  @Get('')
  findOne(@Query() createApplyDto: CreateApplyDto) {
    return this.applyService.findOne(createApplyDto);
  }

  @Get('condition')
  findCondition(@Query() conditionDto: ConditionDto) {
    return this.applyService.findCondition(conditionDto);
  }

  @Get('con')
  findCon(@Query() conditionDto: ConditionDto) {
    return this.applyService.conditionCV(conditionDto);
  }

  @Get('statistic')
  statistic(@Query() query: QueryDto) {
    const { id_student, month, year } = query;
    return this.applyService.statistic(+id_student, +month, +year);
  }

  @Get(':id_company')
  findApply(@Param('id_company') id_company: string) {
    return this.applyService.findApply(+id_company);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applyService.remove(+id);
  }
}
