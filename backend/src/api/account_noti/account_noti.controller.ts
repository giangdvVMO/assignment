import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountNotiService } from './account_noti.service';
import { CreateAccountNotiDto } from './dto/create-account_noti.dto';
import { UpdateAccountNotiDto } from './dto/update-account_noti.dto';

@Controller({
  version: ['1'],
  path: 'account-noti',
})
@ApiTags('Account-Notification')
export class AccountNotiController {
  constructor(private readonly accountNotiService: AccountNotiService) {}

  @Post()
  create(@Body() createAccountNotiDto: CreateAccountNotiDto) {
    return this.accountNotiService.create(createAccountNotiDto);
  }

  @Get()
  findAll() {
    return this.accountNotiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountNotiService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountNotiDto: UpdateAccountNotiDto,
  ) {
    return this.accountNotiService.update(+id, updateAccountNotiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountNotiService.remove(+id);
  }
}
