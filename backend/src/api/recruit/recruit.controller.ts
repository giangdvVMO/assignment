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
import { RecruitService } from './recruit.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { DeleteDto, UpdateRecruitDto } from './dto/update-recruit.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryParamRecruitDto } from './dto/query-recruit.dto';
import { ConfirmRecruitDto } from './dto/confirm-recruit.dto';

@Controller('recruit')
@ApiTags('Recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Post()
  create(@Body() createRecruitDto: CreateRecruitDto) {
    console.log(createRecruitDto);
    return this.recruitService.create(createRecruitDto);
  }

  @Get()
  findAll(@Query() query: QueryParamRecruitDto) {
    return this.recruitService.findAll(query);
  }

  @Get('statistic')
  statistic() {
    return this.recruitService.statistic();
  }

  @Get('statistic/:id_company')
  statisticCompany(@Param('id_company') id_company: string) {
    if (!parseInt(id_company)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitService.statisticCompany(+id_company);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitService.findOne(+id);
  }

  @Patch('confirm/:id')
  confirm(
    @Param('id') id: string,
    @Body() confirmRecruitDto: ConfirmRecruitDto,
  ) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitService.confirm(+id, confirmRecruitDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecruitDto: UpdateRecruitDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitService.update(+id, updateRecruitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() data: DeleteDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.recruitService.remove(+id, +data.delete_id);
  }
}
