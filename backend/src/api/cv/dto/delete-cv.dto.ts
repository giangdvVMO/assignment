import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCvDto {
  @ApiProperty({
    description: 'delete_id',
  })
  @IsNotEmpty()
  @IsString()
  delete_id: string;
}
