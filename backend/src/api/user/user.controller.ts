import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { QueryParamDto } from './dto/query-param.dto';
import { ChangeUserPasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller({
  version: ['1'],
  path: 'account',
})
@ApiTags('Account')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getList(@Query() query: QueryParamDto) {
    console.log(query);
    return this.userService.findAll(query);
  }
  @Get(':id')
  getUser(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.userService.findOneByCondition({ _id: +id });
  }

  @Patch('change-password')
  changPw(@Body() body: ChangeUserPasswordDto) {
    console.log(body);
    return this.userService.changePassword(body);
  }

  @Patch('confirm/:id')
  confirmUser(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.userService.confirmUser(+id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    type: 'number',
    name: 'id',
  })
  deleteUser(@Param('id') id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    return this.userService.remove(+id);
  }
}
