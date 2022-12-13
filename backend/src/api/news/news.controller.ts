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
import { NewsService } from './news.service';
import { ConfirmNewsDto, CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryParamNewsDto } from './dto/query.dto';
import { DeleteDto } from './dto/delete.dto';

@Controller({
  version: ['1'],
  path: 'news',
})
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  findAll(@Query() query: QueryParamNewsDto) {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch('views/:id')
  views(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.newsService.view(+id);
  }

  @Patch('confirm/:id')
  confirm(@Param('id') id: string, @Body() confirmNewsDto: ConfirmNewsDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.newsService.confirm(+id, confirmNewsDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() data: DeleteDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.newsService.remove(+id, +data.delete_id);
  }
}
