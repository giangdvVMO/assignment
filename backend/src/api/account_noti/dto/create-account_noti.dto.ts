import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAccountNotiDto {
  @ApiProperty({
    description: 'send_id',
  })
  @IsNotEmpty()
  send_id: number;

  @ApiProperty({
    description: 'receive_id',
  })
  @IsNotEmpty()
  receive_id: number[];

  @ApiProperty({
    description: 'id_noti',
  })
  @IsNotEmpty()
  id_noti: number;
}

export class CreateAccNotiArrayDto {}
