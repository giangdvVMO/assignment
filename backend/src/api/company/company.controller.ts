import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { ConfirmCompanyDto } from './dto/confirm-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { QueryParamCompanyDto } from './dto/query-param-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller({
  version: ['1'],
  path: 'company',
})
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll(@Query() query: QueryParamCompanyDto) {
    return this.companyService.findAll(query);
  }

  @Get('statistic')
  statistic() {
    return this.companyService.statistic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch('confirm/:id')
  confirm(
    @Param('id') id: string,
    @Body() confirmCompanyDto: ConfirmCompanyDto,
  ) {
    return this.companyService.confirm(+id, confirmCompanyDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
