import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotiService } from './noti.service';
import { CreateNotiDto } from './dto/create-noti.dto';
import { UpdateNotiDto } from './dto/update-noti.dto';
import { AccountNotiService } from '../account_noti/account_noti.service';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: ['1'],
  path: 'noti',
})
@ApiTags('Notifications')
export class NotiController {
  constructor(
    private readonly notiService: NotiService,
    private readonly accountNotiService: AccountNotiService,
  ) {}

  @Post()
  create(@Body() createNotiDto: CreateNotiDto) {
    return this.notiService.create(createNotiDto);
  }

  @Get()
  findAll() {
    return this.notiService.findAll();
  }

  @Get(':count_id')
  findAllAccount(@Param('count_id') count_id: number) {
    return this.notiService.findAllAccount(count_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotiDto: UpdateNotiDto) {
    return this.notiService.update(+id, updateNotiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notiService.remove(+id);
  }
}
