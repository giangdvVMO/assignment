import { PartialType } from '@nestjs/swagger';
import { CreateAccountNotiDto } from './create-account_noti.dto';

export class UpdateAccountNotiDto extends PartialType(CreateAccountNotiDto) {}
