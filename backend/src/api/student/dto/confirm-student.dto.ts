import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmStudentDto {
  @ApiProperty({
    description: 'confirm_id',
  })
  @IsNotEmpty()
  confirm_id: number;
}
