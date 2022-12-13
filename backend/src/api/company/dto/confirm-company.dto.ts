import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmCompanyDto {
  @ApiProperty({
    description: 'confirm_id',
  })
  @IsNotEmpty()
  confirm_id: number;
}
