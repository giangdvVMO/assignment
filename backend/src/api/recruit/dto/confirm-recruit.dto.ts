import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmRecruitDto {
  @ApiProperty({
    description: 'confirm_id',
  })
  @IsNotEmpty()
  confirm_id: number;
}
